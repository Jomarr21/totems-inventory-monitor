import { ForbiddenError, UserInputError } from '@vtex/api'

import type {
  LoyaltyPointsResponse,
  RewardsServiceResponse,
} from '../typings/loyaltyPoints'
import type { ErrorResponse } from '../typings/errors'

interface CustomerData {
  email: string
  document?: string
  documentType?: string
  [key: string]: unknown
}

export async function getLoyaltyPoints(
  ctx: Context,
  next: () => Promise<void>
) {
  const {
    clients: { loyaltyPointsService, safeData },
  } = ctx

  try {
    // Extraer el token de autenticación del usuario de storefront
    // Priorizar la cookie específica de la cuenta sobre la genérica
    const { account } = ctx.vtex
    const accountSpecificCookie = `VtexIdclientAutCookie_${account}`

    const authToken =
      ctx.cookies.get(accountSpecificCookie) ||
      ctx.cookies.get('VtexIdclientAutCookie') ||
      ctx.get('VtexIdclientAutCookie')

    if (!authToken) {
      ctx.status = 401
      ctx.body = {
        message: 'Authentication required. Please log in.',
      } as ErrorResponse

      return
    }

    // Pasar el token al contexto para otros clientes si es necesario
    ctx.vtex.authToken = authToken

    // Obtener datos del cliente autenticado desde SafeData
    // SafeData automáticamente retorna los datos del usuario dueño del token
    let customerData: CustomerData | null = null

    try {
      customerData = await safeData.getAuthenticatedCustomer(authToken, account)
    } catch (error) {
      const isAxiosError =
        error && typeof error === 'object' && 'response' in error

      const statusCode = isAxiosError ? (error as any).response?.status : null

      if (statusCode === 401 || statusCode === 403) {
        ctx.status = 401
        ctx.body = {
          message: 'Invalid or expired authentication token.',
        } as ErrorResponse

        return
      }

      ctx.status = 500
      ctx.body = {
        message: 'Error fetching customer data',
      } as ErrorResponse

      return
    }

    if (!customerData) {
      ctx.status = 404
      ctx.body = {
        message: 'Customer not found',
      } as ErrorResponse

      return
    }

    // Extraer documento del cliente para uso futuro con servicio externo
    const identificationNumber = customerData.document as string | undefined

    if (!identificationNumber) {
      ctx.status = 400
      ctx.body = {
        message: 'Customer document not found',
      } as ErrorResponse

      return
    }

    const store = ctx.vtex.account

    const externalResponse = await loyaltyPointsService.getCustomerRewards({
      document: identificationNumber,
      store,
    })

    const pointsEarned = extractPointsEarned(externalResponse)

    if (pointsEarned === null) {
      ctx.status = 502
      ctx.body = {
        message: 'Invalid response from loyalty points service',
      } as ErrorResponse

      return
    }

    const response: LoyaltyPointsResponse = {
      pointsEarned,
    }

    ctx.status = 200
    ctx.body = response

    await next()
  } catch (error: unknown) {
    console.error('Error getting loyalty points:', error)

    // Si es un error de ForbiddenError o UserInputError, mantener el status code original
    if (error instanceof ForbiddenError) {
      throw error
    }

    if (error instanceof UserInputError) {
      throw error
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    ctx.status = 500
    ctx.body = {
      message: 'Error getting loyalty points',
      error: errorMessage,
    } as ErrorResponse
  }
}

function extractPointsEarned(response: RewardsServiceResponse): number | null {
  if (
    typeof response?.pointsEarned === 'number' &&
    Number.isFinite(response.pointsEarned)
  ) {
    return response.pointsEarned
  }

  if (
    typeof response?.PuntosObtenidos === 'number' &&
    Number.isFinite(response.PuntosObtenidos)
  ) {
    return response.PuntosObtenidos
  }

  const data = (response as any)?.data

  if (
    typeof data?.pointsEarned === 'number' &&
    Number.isFinite(data.pointsEarned)
  ) {
    return data.pointsEarned
  }

  if (
    typeof data?.PuntosObtenidos === 'number' &&
    Number.isFinite(data.PuntosObtenidos)
  ) {
    return data.PuntosObtenidos
  }

  return null
}

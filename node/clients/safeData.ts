import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

interface CustomerData {
  email: string
  document?: string
  documentType?: string
  firstName?: string
  lastName?: string
  [key: string]: unknown
}

const SAFE_DATA_ENTITY = 'CL'

function buildSafeDataDomain(context: IOContext): string {
  const { account } = context

  return `${account}.myvtex.com`
}

function normalizeResponse(
  response: CustomerData[] | { data: CustomerData[] } | null | undefined
): CustomerData[] {
  if (!response) {
    return []
  }

  if (Array.isArray(response)) {
    return response
  }

  if ('data' in response && Array.isArray(response.data)) {
    return response.data
  }

  return []
}

/**
 * Cliente para interactuar con SafeData de VTEX siguiendo la documentación oficial
 * https://developers.vtex.com/docs/apps/vtex.safedata
 */
export class SafeData extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    // VTEX kuberouter bloquea HTTPS saliente, usar HTTP con X-VTEX-Use-Https header
    const baseURL = `http://${buildSafeDataDomain(context)}`

    const defaultHeaders: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-VTEX-Use-Https': 'true',
    }

    super(baseURL, context, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options?.headers ?? {}),
      },
    })
  }

  /**
   * Obtiene los datos del cliente autenticado usando solo el token
   * SafeData retornará los datos del usuario dueño del token
   * 
   * @param authToken - Token de autenticación del usuario
   * @param account - Nombre de la cuenta VTEX
   */
  public async getAuthenticatedCustomer(
    authToken: string,
    account: string
  ): Promise<CustomerData | null> {
    try {
      const cookieName = `VtexIdclientAutCookie_${account}`
      const cookieHeader = `${cookieName}=${authToken}`

      // Buscar sin filtro de email - SafeData retornará solo los datos del usuario autenticado
      const response = await this.http.get<
        CustomerData[] | { data: CustomerData[] }
      >(`/api/io/safedata/${SAFE_DATA_ENTITY}/search`, {
        params: {
          _fields: 'email,document,documentType,firstName,lastName,id',
        },
        metric: 'safedata-get-authenticated-customer',
        headers: {
          Cookie: cookieHeader,
        },
      })

      const customers = normalizeResponse(response)

      return customers.length > 0 ? customers[0] : null
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any
        console.error('[SafeData] Error fetching authenticated customer:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
        })
      }
      throw error
    }
  }

  /**
   * Obtiene los datos del cliente desde SafeData usando la ruta documentada
   * GET /api/io/safedata/{entity}/search?_where=email=...
   * 
   * @param email - Email del cliente a buscar
   * @param authToken - Token de autenticación del usuario
   * @param account - Nombre de la cuenta VTEX
   */
  public async getCustomerByEmail(
    email: string,
    authToken: string,
    account: string
  ): Promise<CustomerData | null> {
    try {
      const cookieName = `VtexIdclientAutCookie_${account}`
      const cookieHeader = `${cookieName}=${authToken}`

      const response = await this.http.get<
        CustomerData[] | { data: CustomerData[] }
      >(`/api/io/safedata/${SAFE_DATA_ENTITY}/search`, {
        params: {
          _where: `email=${email}`,
          _fields: 'email,document,documentType,firstName,lastName,id',
        },
        metric: 'safedata-get-customer-search',
        headers: {
          Cookie: cookieHeader,
        },
      })

      const customers = normalizeResponse(response)

      return customers.length > 0 ? customers[0] : null
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any
        console.error('[SafeData] Error fetching customer:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
        })
      }
      throw error
    }
  }

  public async validateUserEmail(email: string, authToken: string, account: string): Promise<boolean> {
    try {
      const customer = await this.getCustomerByEmail(email, authToken, account)
      return customer !== null
    } catch (error) {
      console.error('[SafeData] Error validating user email:', error)
      return false
    }
  }
}

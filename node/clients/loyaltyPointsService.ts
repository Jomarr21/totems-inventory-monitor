import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

import { getEnvironmentConfig } from '../config'
import type { RewardsServiceResponse } from '../typings/loyaltyPoints'
import { EnvironmentSettings } from '../typings/config'
import { calculateHMAC } from '../utils/auth/hmac'

export class LoyaltyPointsService extends ExternalClient {
  private envConfig: EnvironmentSettings

  constructor(context: IOContext, options?: InstanceOptions) {
    const envConfig = getEnvironmentConfig(context?.production)
    const baseURL = envConfig.loyaltyPointsServiceUrl

    console.info('[LoyaltyPointsService] baseURL=', baseURL)

    super(baseURL, context, options)

    this.envConfig = envConfig
  }

  public async getCustomerRewards(params: {
    document: string
    store: string
  }): Promise<RewardsServiceResponse> {
    const endpoint = '/customers/rewards'
    // Obtener credenciales de autenticación
    const { apiKey, hmacSecret } = this.envConfig

    // Preparar body como JSON string (sin espacios extra para consistencia)
    const bodyString = ''

    // Obtener timestamp en milisegundos
    const timestamp = Date.now().toString()

    // Calcular firma HMAC
    const hmacSignature = calculateHMAC(
      'GET',
      `${endpoint}?document=${params.document}&store=${params.store}`,
      bodyString,
      timestamp,
      hmacSecret
    )

    // Preparar headers con autenticación
    const authHeaders = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'x-timestamp': timestamp,
      'x-hmac-signature': hmacSignature,
    }

    // eslint-disable-next-line no-console
    console.log('[Rewards] Request details:', {
      method: 'GET',
      payload: bodyString,
      headers: {
        'x-api-key': apiKey,
        'x-timestamp': timestamp,
        'x-hmac-signature': `${hmacSignature.substring(0, 20)}...`,
      },
      timestamp: new Date().toISOString(),
    })

    return this.http.get<RewardsServiceResponse>(endpoint, {
      params,
      metric: 'loyalty-points-service-get-customer-rewards',
      headers: authHeaders,
    })
  }
}

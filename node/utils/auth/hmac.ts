import * as crypto from 'crypto'

import { getEnvironmentConfig } from '../../config'

export function calculateHMAC(
  method: string,
  path: string,
  body: Record<string, unknown> | string,
  timestamp: string,
  secretKey: string
): string {
  const bodyString = typeof body === 'string' ? body : JSON.stringify(body)
  const dataToSign = `${method}:${path}:${bodyString}:${timestamp}`

  const hmacSignature = crypto
    .createHmac('sha256', secretKey)
    .update(dataToSign)
    .digest('hex')

  return hmacSignature
}

export async function getAuthCredentials(
  isProd: boolean
): Promise<{
  apiKey: string
  hmacSecret: string
}> {
  const envConfig = getEnvironmentConfig(isProd)

  console.info('[Auth] env=', envConfig)

  return {
    apiKey: envConfig.apiKey,
    hmacSecret: envConfig.hmacSecret,
  }
}

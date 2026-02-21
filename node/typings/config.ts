export type EnvironmentName = 'prod' | 'qa'

export type EnvironmentSettings = {
  loyaltyPointsServiceUrl: string
  apiKey: string
  hmacSecret: string
}

export type ConfigFile = {
  appId: string
  prod: EnvironmentSettings
  qa: EnvironmentSettings
}

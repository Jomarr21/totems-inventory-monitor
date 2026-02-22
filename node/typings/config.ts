export type EnvironmentName = 'prod' | 'qa'

export type EnvironmentSettings = {
  apiKey: string
  apiToken: string
}

export type ConfigFile = {
  prod: EnvironmentSettings
  qa: EnvironmentSettings
}

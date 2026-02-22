import { ConfigFile, EnvironmentSettings } from '../typings/config'
import environments from './environments.json'

const config = environments as ConfigFile

export function getEnvironmentConfig(isProd?: boolean): EnvironmentSettings {
  const envName = isProd ? 'prod' : 'qa'

  return config[envName]
}

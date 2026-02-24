import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import { getEnvironmentConfig } from '../../config'

export class WhiteLabelsClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    const envConfig = getEnvironmentConfig(context?.production)

    super('', context, {
      ...options,
      headers: {
        'X-VTEX-Use-Https': 'true',
        'X-VTEX-API-AppKey': envConfig.apiKey,
        'X-VTEX-API-AppToken': envConfig.apiToken,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
  }

  public getSkuWarehouses = async (wl: string, sku: string) => {
    const url = `https://${wl}.vtexcommercestable.com.br/api/logistics/pvt/inventory/skus/${sku}`
    return this.http.get<any>(url)
  }

  public getInventoryByWarehouse = async (wl: string, sku: string, warehouseId: string) => {
    const url = `https://${wl}.vtexcommercestable.com.br/api/logistics/pvt/inventory/items/${sku}/warehouses/${warehouseId}`
    return this.http.get<any>(url)
  }
}

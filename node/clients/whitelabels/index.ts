import type { InstanceOptions, IOContext, IOResponse } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import { getEnvironmentConfig } from '../../config'

export class WhiteLabelsClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    const envConfig = getEnvironmentConfig(context?.production)

    super('', context, {...options,
    headers: {
      'X-VTEX-Use-Https': 'true',
      'X-VTEX-API-AppKey': envConfig.apiKey,
      "X-VTEX-API-AppToken": envConfig.apiToken,
      "Content-Type":"application/json",
      "Accept":"application/json"
    }}
      );
  }

  public getInventory = async (wl: string, sku: string, warehouseId: string): Promise<IOResponse<string>> => {
    return  this.http.getRaw(`https://${wl}.vtexcommercestable.com.br/api/logistics/pvt/inventory/items/${sku}/warehouses/${warehouseId}/dispatched`, {});
  };
}

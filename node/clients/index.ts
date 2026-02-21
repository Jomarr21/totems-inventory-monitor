import { IOClients } from '@vtex/api'

import { LoyaltyPointsService } from './loyaltyPointsService'
import { SafeData } from './safeData'
import { VtexId } from './vtexId'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get loyaltyPointsService() {
    return this.getOrSet('loyaltyPointsService', LoyaltyPointsService)
  }

  public get safeData() {
    return this.getOrSet('safeData', SafeData)
  }

  public get vtexId() {
    return this.getOrSet('vtexId', VtexId)
  }
}

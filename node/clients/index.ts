import { IOClients } from '@vtex/api'
import { WhiteLabelsClient } from './whitelabels'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {

  public get whiteLabelsClient() {
    return this.getOrSet('whiteLabelsClient', WhiteLabelsClient )
  }
}

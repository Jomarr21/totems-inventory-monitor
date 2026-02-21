import type { ClientsConfig, ServiceContext, RecorderState } from '@vtex/api'
import { method, Service } from '@vtex/api'

import { Clients } from './clients'
import { getLoyaltyPoints } from './middlewares/loyaltyPoints'

const TIMEOUT_MS = 800
const LOYALTY_POINTS_TIMEOUT_MS = 60000

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    loyaltyPointsService: {
      timeout: LOYALTY_POINTS_TIMEOUT_MS,
    },
  },
}

declare global {
  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients, State>

  // The shape of our State object found in `ctx.state`. This is used as state bag to communicate between middlewares.
  type State = RecorderState
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  routes: {
    // Endpoint proxy que recibe del frontend
    loyaltyPoints: method({
      GET: [getLoyaltyPoints],
    }),
  },
})

import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

interface VtexIdUser {
    user: string // email del usuario
    userId: string
    [key: string]: unknown
}

/**
 * Cliente para obtener información del usuario autenticado desde VTEX ID
 */
export class VtexId extends JanusClient {
    constructor(context: IOContext, options?: InstanceOptions) {
        super(context, {
            ...options,
            headers: {
                VtexIdclientAutCookie: context.authToken,
                ...options?.headers,
            },
        })
    }

    /**
     * Obtiene el email del usuario autenticado desde el token
     */
    public async getAuthenticatedUser(authToken: string): Promise<VtexIdUser> {
        return this.http.get<VtexIdUser>('/api/vtexid/pub/authenticated/user', {
            params: { authToken },
            metric: 'vtexid-get-user',
        })
    }
}

export interface ExternalServiceRequest {
  numeroIdentificacion: string
  tipoIdentificacion: number
  StoreID: number
  Canal: string
}

export interface RewardsServiceResponse {
  pointsEarned?: number
  PuntosObtenidos?: number
  [key: string]: unknown
}

export interface Reward {
  Tipo: string
  MaximoACanjear: number
}

export interface ExternalServiceResponse {
  PuntosObtenidos: number
  MetaPuntos: number
  PuntosFaltantes: number
  PorcentajeAvance: number
  Recompensas: Reward[]
}

export interface LoyaltyPointsRequest {
  identificationNumber: string
  identificationType: number
  storeID?: number
  channel?: string
  [key: string]: unknown
}

export interface LoyaltyPointsResponse {
  pointsEarned: number
}

import type { ExternalServiceResponse } from '../typings/loyaltyPoints'

/**
 * Genera datos simulados de puntos de lealtad para pruebas
 * Esta función simula la respuesta de un servicio externo
 * TODO: Eliminar esta función cuando el servicio externo esté disponible
 */
export function generateSimulatedLoyaltyPoints(): ExternalServiceResponse {
  const pointsEarned = Math.floor(Math.random() * 10000) + 1
  const targetPoints = Math.floor(Math.random() * 10000) + 1
  const pointsRemaining = Math.max(0, targetPoints - pointsEarned)
  const progressPercentage =
    targetPoints > 0
      ? Number(((pointsEarned / targetPoints) * 100).toFixed(2))
      : 0

  return {
    PuntosObtenidos: pointsEarned,
    MetaPuntos: targetPoints,
    PuntosFaltantes: pointsRemaining,
    PorcentajeAvance: progressPercentage,
    Recompensas: [
      {
        Tipo: 'Millas',
        MaximoACanjear: Number((pointsEarned * 5.23).toFixed(2)),
      },
      {
        Tipo: 'Dolares',
        MaximoACanjear: Number((pointsEarned * 0.0133).toFixed(2)),
      },
    ],
  }
}

const wls = ['jumbocolombiaretiroentiendahayuelos'] // TO DO: Agregar los WL que falten. Hacer lo mismo en el Manifest

export async function inventory(ctx: Context) {
  const {
    clients: { whiteLabelsClient },
    url,
  } = ctx

  const sku = url.substring(url.lastIndexOf('/') + 1)

  const response = await Promise.all(
    wls.map(async (wl) => {
      try {
        const skusResp = await whiteLabelsClient.getSkuWarehouses(wl, sku)
        const balances: Array<{ warehouseId: string }> = skusResp?.balance || []

        const inventories = await Promise.all(
          balances.map(async ({ warehouseId }) => {
            try {
              const invResp = await whiteLabelsClient.getInventoryByWarehouse(wl, sku, warehouseId)

              return invResp.map((inv: any) => ({
                whitelabel: wl,
                wlUrl: `https://${wl}.myvtex.com/admin`,
                warehouseId,
                totalQuantity: inv?.totalQuantity ?? null,
                reservedQuantity: inv?.reservedQuantity ?? null,
                availableQuantity: inv?.availableQuantity ?? null,
              }))
            } catch (err: any) {
              return [
                {
                  whitelabel: wl,
                  wlUrl: `https://${wl}.myvtex.com/admin`,
                  warehouseId,
                  error:
                    err?.message ?? 'Error fetching warehouse inventory',
                },
              ]
            }
          })
        )

        return inventories.flat()
      } catch (err: any) {
        return [
          {
            whitelabel: wl,
            wlUrl: `https://${wl}.myvtex.com/admin`,
            error: err?.message ?? 'Error fetching WL sku list',
          },
        ]
      }
    })
  )

  ctx.status = 200
  ctx.body = response.flat()
}

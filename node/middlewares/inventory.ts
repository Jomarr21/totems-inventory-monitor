const wls = ['jumbocolombiaioswl108', 'jumbocolombiaioswl11', 'jumbocolombiaioswl126', 'jumbocolombiaioswl128', 'jumbocolombiaioswl13', 'jumbocolombiaioswl14', 'jumbocolombiaioswl148', 'jumbocolombiaioswl15', 'jumbocolombiaioswl16', 'jumbocolombiaioswl167', 'jumbocolombiaioswl17', 'jumbocolombiaioswl18', 'jumbocolombiaioswl185',
              'jumbocolombiaioswl19', 'jumbocolombiaioswl194', 'jumbocolombiaioswl22', 'jumbocolombiaioswl23', 'jumbocolombiaioswl24', 'jumbocolombiaioswl27', 'jumbocolombiaioswl31', 'jumbocolombiaioswl36', 'jumbocolombiaioswl43', 'jumbocolombiaioswl44', 'jumbocolombiaioswl447', 'jumbocolombiaioswl45', 'jumbocolombiaioswl47', 'jumbocolombiaioswl48',
              'jumbocolombiaioswl70', 'jumbocolombiaioswl76', 'jumbocolombiaioswl83', 'jumbocolombiaioswl84', 'jumbocolombiaioswl87', 'jumbocolombiaioswl9', 'metrocolombiaioswl10', 'metrocolombiaioswl124', 'metrocolombiaioswl166', 'metrocolombiaioswl171', 'metrocolombiaioswl18', 'metrocolombiaioswl183', 'metrocolombiaioswl195', 'metrocolombiaioswl203',
              'metrocolombiaioswl25', 'metrocolombiaioswl26', 'metrocolombiaioswl28', 'metrocolombiaioswl32', 'metrocolombiaioswl33', 'metrocolombiaioswl34', 'metrocolombiaioswl35', 'metrocolombiaioswl38', 'metrocolombiaioswl39', 'metrocolombiaioswl40', 'metrocolombiaioswl42', 'metrocolombiaioswl49', 'metrocolombiaioswl71', 'metrocolombiaioswl73',
              'metrocolombiaioswl74', 'metrocolombiaioswl75', 'metrocolombiaioswl77', 'metrocolombiaioswl78', 'metrocolombiaioswl79', 'metrocolombiaioswl80', 'metrocolombiaioswl81', 'metrocolombiaioswl85', 'metrocolombiaioswl97', 'metrocolombiaioswl82']

// TO DO: Eliminar WLS no necesarios y agregar los que falten. Hacer lo mismo en el Manifest

export async function inventory(ctx: Context) {
  const {clients: { whiteLabelsClient }, url}= ctx
  const sku = url.substring(url.lastIndexOf('/') + 1)

  const response = await Promise.all(wls.map(async url => {
    const warehouseId = url.replace(/\D/g, "")
    const resp = await whiteLabelsClient.getInventory(url,sku, warehouseId);
    return {whitelabel: url, wlUrl:`https://${url}.myvtex.com/admin`,info: resp.data}
  }));

  console.log(response, wls);
  ctx.status = 200
  ctx.body = response
}

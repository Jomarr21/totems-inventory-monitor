import React, { useEffect, useState } from 'react'
import { Image } from 'vtex.store-image'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import styles from './styles.css'

const handleModalOpening = () => {
  const tigger = document.querySelector('.vtex-modal-layout-0-x-triggerContainer--contentBtn') as HTMLButtonElement
  tigger?.click()
}

const DeliveryMethodTrigger: React.FC = () => {
  const { orderForm } = useOrderForm()
  const [deliveryMethod, setDeliveryMethod] = useState<string | null>(null)
  const shippingData = orderForm?.shipping

  useEffect(() => {
    const currentDelivery = localStorage?.getItem('delivery_method')
    setDeliveryMethod(currentDelivery)
  }, [])

  return (
    <div className={styles['delivery-method-trigger']}>
      <Image
        src="/arquivos/pin-active.svg"
        alt="Icono del metodo de entrega a domicilio"
      />

      <div className={styles['delivery-method-trigger__content']}>
        <span className={styles['delivery-method-trigger__title']}>{!deliveryMethod ? 'Selecciona tu' : deliveryMethod === "RT" ? 'Retiro en tienda' : 'Envío a domicilio'}</span>
        <span className={styles['delivery-method-trigger__address']}>
          {!deliveryMethod ? 'Método de entrega' : deliveryMethod === "RT" ? shippingData?.selectedAddress?.complement : shippingData?.selectedAddress?.street}
        </span>

        {(shippingData) &&
          <button className={styles['delivery-method-trigger__button']} onClick={handleModalOpening}>
            Cambiar
            <span>›</span>
          </button>
        }
      </div>
    </div>
  )
}

export default DeliveryMethodTrigger

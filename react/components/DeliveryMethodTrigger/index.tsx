import React, { useEffect, useState } from 'react'
import styles from './styles.css'

const handleModalOpening = () => {
  const tigger = document.querySelector('.vtex-modal-layout-0-x-triggerContainer--contentBtn') as HTMLButtonElement
  tigger?.click()
}

const DeliveryMethodTrigger: React.FC = () => {
  const [deliveryMethod, setDeliveryMethod] = useState<string | null>(null)

  useEffect(() => {
    const currentDelivery = localStorage?.getItem('delivery_method')
    setDeliveryMethod(currentDelivery)
  }, [])

  return (
    <div className={styles['delivery-method-trigger']}>

      <div className={styles['delivery-method-trigger__content']}>
        <span className={styles['delivery-method-trigger__title']}>{!deliveryMethod ? 'Selecciona tu' : deliveryMethod === "RT" ? 'Retiro en tienda' : 'Envío a domicilio'}</span>
        <span className={styles['delivery-method-trigger__address']}>Método de entrega</span>

        <button className={styles['delivery-method-trigger__button']} onClick={handleModalOpening}>
          Cambiar
          <span>›</span>
        </button>
      </div>
    </div>
  )
}

export default DeliveryMethodTrigger

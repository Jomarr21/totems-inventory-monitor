import { useEffect } from "react"

const LocationModalOpener = () => {

  useEffect(() => {
    const timer = setTimeout(() => {
      const btn = document.querySelector('.vtex-modal-layout-0-x-triggerContainer--contentBtn')
      const shouldOpen = localStorage.getItem("openDeliveryModal")

      if (shouldOpen === "true") {
        (btn as HTMLButtonElement).click()
        localStorage.removeItem("openDeliveryModal")
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return null
}

export default LocationModalOpener

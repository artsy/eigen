import { useContext, useMemo } from "react"
import { NotificationContext } from "./NotificationProvider"

const useNotificationContext = () => useContext(NotificationContext)

export const useNotification = () => {
  const contextValue = useNotificationContext()

  return useMemo(
    () => ({
      show: contextValue.show,
      hide: contextValue.hide,
      hideOldest: contextValue.hideOldest,
    }),
    [contextValue]
  )
}


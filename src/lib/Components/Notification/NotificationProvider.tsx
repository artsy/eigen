import React, { useCallback, useMemo, useState } from "react"
import { Notification, NotificationPlacement, NotificationProps } from "./Notification"

interface NotificationContextValue {
  show: (options: Omit<NotificationProps, "id" | "positionIndex">) => void
  hide: (id: string) => void
}

// tslint:disable-next-line:no-empty
export const NotificationContext = React.createContext<NotificationContextValue>({ show: () => {}, hide: () => {} })

const filterNotificationsAndPosition = (
  notifications: Array<Omit<NotificationProps, "positionIndex">>,
  placement: NotificationPlacement
): NotificationProps[] => {
  const filteredByPlacement = notifications.filter((t) => t.placement === placement)
  const formatted = filteredByPlacement.map((notification, positionIndex) => ({
    ...notification,
    positionIndex,
  }))

  return formatted
}

export const NotificationProvider: React.FC = ({ children }) => {
  const [notifications, setNotifications] = useState<Array<Omit<NotificationProps, "positionIndex">>>([])

  const show: NotificationContextValue["show"] = useCallback(
    (options) => {
      setNotifications((prevNotifications) => [...prevNotifications, { id: `${Date.now()}`, ...options }])
    },
    [setNotifications]
  )

  const hide: NotificationContextValue["hide"] = useCallback(
    (id) => {
      setNotifications((prevNotifications) => prevNotifications.filter((t) => t.id !== id))
    },
    [setNotifications]
  )

  const topNotifications = useMemo(() => filterNotificationsAndPosition(notifications, "top"), [notifications])
  const bottomNotifications = useMemo(() => filterNotificationsAndPosition(notifications, "bottom"), [notifications])

  return (
    <NotificationContext.Provider value={{ show, hide }}>
      {children}
      {[...topNotifications, ...bottomNotifications].map((notificationProps) => (
        <Notification key={notificationProps.id} {...notificationProps} />
      ))}
    </NotificationContext.Provider>
  )
}

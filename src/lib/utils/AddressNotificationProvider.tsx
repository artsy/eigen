import { SavedAddressNotification } from "lib/Scenes/SavedAddresses/SavedAddressNotification"
import React, { ReactNode, useCallback, useEffect, useState } from "react"

interface NotificationContextProps {
  notificationVisible: boolean
  action: string
  setNotificationState?: React.Dispatch<
    React.SetStateAction<{
      notificationVisible: boolean
      action: string
    }>
  >
}

export const AddressNotificationContext = React.createContext<NotificationContextProps>({
  notificationVisible: false,
  action: "",
})

export default ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState({ notificationVisible: false, action: "" })
  let delay: NodeJS.Timeout

  const setNotificationState = useCallback(
    (updates) => {
      setState({ ...state, ...updates })
    },
    [state, setState]
  )

  const getContextValue = useCallback(
    () => ({
      ...state,
      setNotificationState,
    }),
    [state, setNotificationState]
  )

  useEffect(() => {
    delay = setTimeout(() => {
      getContextValue().setNotificationState({ action: "", notificationVisible: false })
    }, 6000)
    return () => {
      clearTimeout(delay)
    }
  }, [getContextValue().notificationVisible])

  return (
    <AddressNotificationContext.Provider value={getContextValue()}>
      <SavedAddressNotification showModal={getContextValue().notificationVisible} />
      {children}
    </AddressNotificationContext.Provider>
  )
}

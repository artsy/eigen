import React, { ReactNode, useState } from "react"

interface Typesss {
  notificationState: {
    notificationVisible: boolean
    action: string
  }
  setNotificationState: React.Dispatch<
    React.SetStateAction<{
      notificationVisible: boolean
      action: string
    }>
  >
}

export const AddressNotificationContext = React.createContext<Typesss>({
  notificationState: {
    notificationVisible: false,
    action: "",
  },
  setNotificationState: {
    notificationVisible: false,
    action: "",
  },
})

export default ({ children }: { children: ReactNode }) => {
  const [notificationState, setNotificationState] = useState({ notificationVisible: false, action: "" })
  const store = {
    notificationState,
    setNotification: { setNotificationState },
  }

  return <AddressNotificationContext.Provider value={store}>{children}</AddressNotificationContext.Provider>
}

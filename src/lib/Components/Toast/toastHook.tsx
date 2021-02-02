// Some stealing from https://github.com/arnnis/react-native-fast-toast
// but simplified
import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import { Toast, ToastProps } from "./Toast"

interface ToastContextValue {
  show: (message: string) => void
}

const ToastContext = React.createContext((null as unknown) as ToastContextValue)

export const useToast = () => {
  const contextValue = useContext(ToastContext)

  return useMemo(
    () => ({
      show: contextValue.show,
      hideOldest: contextValue.hideOldest,
    }),
    [contextValue]
  )
}

export const ToastProvider: React.FC = ({ children }) => {
  const [refState, setRefState] = useState<ToastContextValue | null>(null)
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const show = (message: string) => {
    setToasts((prevToasts) => [
      ...prevToasts,
      { id: Math.random().toString(), message: message + Math.random().toString() },
    ])
  }

  const hideOldest = () => {
    setToasts((prevToasts) => {
      const [, ...tail] = prevToasts
      return tail
    })
  }

  useEffect(() => {
    setRefState({
      show,
      hideOldest,
    })
  }, [])

  return (
    <ToastContext.Provider value={refState!}>
      {children}
      {toasts.map((toastProps) => (
        <Toast ref={toastRef} {...toastProps} />
      ))}
    </ToastContext.Provider>
  )
}

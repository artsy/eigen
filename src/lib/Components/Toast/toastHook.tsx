// Some stealing from https://github.com/arnnis/react-native-fast-toast
// but simplified
import { useCounter } from "lib/utils/useCounter"
import React, { useCallback, useContext, useMemo, useRef, useState } from "react"
import { Toast, ToastProps, ToastPlacement } from "./Toast"

interface ToastContextValue {
  show: (message: string, placement: ToastPlacement, options?: Omit<ToastProps, "id" | "placement" | "message">) => void
  hide: (id: string) => void
  hideOldest: () => void
}

const ToastContext = React.createContext((null as unknown) as ToastContextValue)

export const useToast = () => {
  const contextValue = useContext(ToastContext)

  return useMemo(
    () => ({
      show: contextValue.show,
      hide: contextValue.hide,
      hideOldest: contextValue.hideOldest,
    }),
    [contextValue]
  )
}

export const ToastProvider: React.FC = ({ children }) => {
  const toastRef = useRef(null)
  const [toasts, setToasts] = useState<ToastProps[]>([])
  const [id, incrementId] = useCounter()

  const show: ToastContextValue["show"] = useCallback(
    (message, placement, options) => {
      setToasts((prevToasts) => [...prevToasts, { id: `${id}`, placement, message, ...options }])
      incrementId()
    },
    [setToasts, id, incrementId]
  )

  const hide: ToastContextValue["hide"] = useCallback(
    (id) => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id))
    },
    [setToasts]
  )

  const hideOldest: ToastContextValue["hideOldest"] = useCallback(() => {
    setToasts((prevToasts) => {
      const [, ...tail] = prevToasts
      return tail
    })
  }, [setToasts])

  return (
    <ToastContext.Provider value={{ show, hide, hideOldest }}>
      {children}
      {toasts.map((toastProps) => (
        <Toast ref={toastRef} {...toastProps} />
      ))}
    </ToastContext.Provider>
  )
}

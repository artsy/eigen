// Some stealing from https://github.com/arnnis/react-native-fast-toast
// but simplified
import React, { useCallback, useContext, useMemo, useState } from "react"
import useCounter from "react-use/lib/useCounter"
import { Toast, ToastPlacement, ToastProps } from "./Toast"

interface ToastContextValue {
  show: (
    message: string,
    placement: ToastPlacement,
    options?: Omit<ToastProps, "id" | "positionIndex" | "placement" | "message">
  ) => void
  hide: (id: string) => void
  hideOldest: () => void
}

// tslint:disable-next-line:no-empty
const ToastContext = React.createContext<ToastContextValue>({ show: () => {}, hide: () => {}, hideOldest: () => {} })
const useToastContext = () => useContext(ToastContext)

export const useToast = () => {
  const contextValue = useToastContext()

  return useMemo(
    () => ({
      show: contextValue.show,
      hide: contextValue.hide,
      hideOldest: contextValue.hideOldest,
    }),
    [contextValue]
  )
}

const filterToastsAndPosition = (
  toasts: Array<Omit<ToastProps, "positionIndex">>,
  placement: ToastPlacement
): ToastProps[] =>
  toasts
    .filter((t) => t.placement === placement)
    .reduce<{ idx: number; arr: ToastProps[] }>(
      ({ idx, arr }, t) => ({ idx: idx + 1, arr: [...arr, { ...t, positionIndex: idx }] }),
      { idx: 0, arr: [] }
    ).arr

export const ToastProvider: React.FC = ({ children }) => {
  const [toasts, setToasts] = useState<Array<Omit<ToastProps, "positionIndex">>>([])
  const [nextId, { inc: incrementNextId }] = useCounter()

  const show: ToastContextValue["show"] = useCallback(
    (message, placement, options) => {
      setToasts((prevToasts) => [...prevToasts, { id: `${nextId}`, placement, message, ...options }])
      incrementNextId()
    },
    [setToasts, nextId, incrementNextId]
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

  const topToasts = useMemo(() => filterToastsAndPosition(toasts, "top"), [toasts])
  const bottomToasts = useMemo(() => filterToastsAndPosition(toasts, "bottom"), [toasts])
  const middleToasts = useMemo(() => filterToastsAndPosition(toasts, "middle"), [toasts])

  return (
    <ToastContext.Provider value={{ show, hide, hideOldest }}>
      {children}
      {[...topToasts, ...bottomToasts, ...middleToasts].map((toastProps) => (
        <Toast key={toastProps.id} {...toastProps} />
      ))}
    </ToastContext.Provider>
  )
}

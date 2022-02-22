import { GlobalStore } from "app/store/GlobalStore"
import React, { useContext, useMemo } from "react"
import { Toast } from "./Toast"
import { ToastComponent } from "./ToastComponent"
import { ToastDetails, ToastPlacement } from "./types"

type ToastContextValue = typeof Toast

const ToastContext = React.createContext<ToastContextValue>({
  // tslint:disable-next-line:no-empty
  show: () => {},
  // tslint:disable-next-line:no-empty
  hide: () => {},
  // tslint:disable-next-line:no-empty
  hideOldest: () => {},
})
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
  toasts: Array<Omit<ToastDetails, "positionIndex">>,
  placement: ToastPlacement
): ToastDetails[] =>
  toasts
    .filter((t) => t.placement === placement)
    .reduce<{ idx: number; arr: ToastDetails[] }>(
      ({ idx, arr }, t) => ({ idx: idx + 1, arr: [...arr, { ...t, positionIndex: idx }] }),
      { idx: 0, arr: [] }
    ).arr

export const ToastProvider: React.FC = ({ children }) => {
  const toasts = GlobalStore.useAppState((store) => store.toast.sessionState.toasts)

  const topToasts = useMemo(() => filterToastsAndPosition(toasts, "top"), [toasts])
  const bottomToasts = useMemo(() => filterToastsAndPosition(toasts, "bottom"), [toasts])
  const middleToasts = useMemo(() => filterToastsAndPosition(toasts, "middle"), [toasts])

  return (
    <ToastContext.Provider value={{ ...Toast }}>
      {children}
      {[...topToasts, ...bottomToasts, ...middleToasts].map((toastProps) => (
        <ToastComponent key={`${toastProps.id}`} {...toastProps} />
      ))}
    </ToastContext.Provider>
  )
}

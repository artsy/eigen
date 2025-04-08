import { GlobalStore } from "app/store/GlobalStore"
import { useMemo } from "react"
import { ToastComponent } from "./ToastComponent"
import { ToastDetails, ToastOptions, ToastPlacement } from "./types"

export const useToast = () => {
  const add = GlobalStore.actions.toast.add
  const remove = GlobalStore.actions.toast.remove
  const removeOldest = GlobalStore.actions.toast.removeOldest

  return {
    show: (message: string, placement: ToastPlacement, options?: ToastOptions) =>
      add({ message, placement, options }),
    hide: (id: number) => remove(id),
    hideOldest: removeOldest,
  }
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

export const ToastProvider = ({ children }: { children?: React.ReactNode }) => {
  const toasts = GlobalStore.useAppState((store) => store.toast.sessionState.toasts)

  const topToasts = useMemo(() => filterToastsAndPosition(toasts, "top"), [toasts])
  const bottomToasts = useMemo(() => filterToastsAndPosition(toasts, "bottom"), [toasts])
  const middleToasts = useMemo(() => filterToastsAndPosition(toasts, "middle"), [toasts])

  return (
    <>
      {children}
      {[...topToasts, ...bottomToasts, ...middleToasts].map((toastProps) => (
        <ToastComponent key={`${toastProps.id}`} {...toastProps} />
      ))}
    </>
  )
}

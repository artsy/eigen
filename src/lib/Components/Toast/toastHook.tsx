import React, { useMemo } from "react"
import { ToastComponent } from "./ToastComponent"
import { useToastsStore } from "./ToastStore"
import { ToastDetails, ToastOptions, ToastPlacement } from "./types"

export const useToast = () =>
  useToastsStore((state) => ({
    show: (message: string, placement: ToastPlacement, options?: ToastOptions) =>
      state.add({ message, placement, options }),
    hide: state.remove,
    hideOldest: state.removeOldest,
  }))

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
  const toasts = useToastsStore((state) => state.toasts)

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

import { useToastsStore } from "./ToastStore"
import { ToastOptions, ToastPlacement } from "./types"

export const Toast = {
  show: (message: string, placement: ToastPlacement, options?: ToastOptions) =>
    useToastsStore.getState().add({ message, placement, options }),
  hide: (id: number) => useToastsStore.getState().remove(id),
  hideOldest: () => useToastsStore.getState().removeOldest(),
}

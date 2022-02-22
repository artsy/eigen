import { GlobalStore } from "app/store/GlobalStore"
import { ToastOptions, ToastPlacement } from "./types"

export const Toast = {
  show: (message: string, placement: ToastPlacement, options?: ToastOptions) =>
    GlobalStore.actions.toast.add({ message, placement, options }),
  hide: (id: number) => GlobalStore.actions.toast.remove(id),
  hideOldest: () => GlobalStore.actions.toast.removeOldest(),
}

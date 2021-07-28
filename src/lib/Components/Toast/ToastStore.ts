import _ from "lodash"
import create from "zustand"
import { ToastDetails, ToastOptions, ToastPlacement } from "./types"

interface ToastsState {
  nextId: number
  toasts: Array<Omit<ToastDetails, "positionIndex">>

  add: (_: { message: string; placement: ToastPlacement; options?: ToastOptions }) => void
  remove: (id: number) => void
  removeOldest: () => void
}

export const useToastsStore = create<ToastsState>((set) => ({
  nextId: 0,
  toasts: [],

  add: ({ message, placement, options }) =>
    set((prev) => ({
      toasts: _.concat(prev.toasts, {
        id: prev.nextId,
        message,
        placement,
        ...options,
      }),
      nextId: (prev.nextId += 1),
    })),
  remove: (id) =>
    set((prev) => ({
      toasts: prev.toasts.filter((toast) => toast.id !== id),
    })),
  removeOldest: () =>
    set((prev) => ({
      toasts: _.drop(prev.toasts, 1),
    })),
}))

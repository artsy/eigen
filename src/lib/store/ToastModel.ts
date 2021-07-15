import { action, Action, thunk, Thunk } from "easy-peasy"
import { ToastDetails, ToastOptions, ToastPlacement } from "lib/Components/Toast/types"

export interface ToastModel {
  sessionState: {
    nextId: number
    toasts: Array<Omit<ToastDetails, "positionIndex">>
  }

  add: Thunk<
    this,
    {
      message: string
      placement: ToastPlacement
      options?: ToastOptions
    },
    any,
    {},
    void
  >
  remove: Action<this, this["sessionState"]["nextId"]>
  removeOldest: Action<this>

  _incrementNextId: Action<this>
  _add: Action<
    this,
    {
      message: string
      placement: ToastPlacement
      options?: ToastOptions
    }
  >
}

export const getToastModel = (): ToastModel => ({
  sessionState: {
    nextId: 0,
    toasts: [],
  },

  add: thunk((actions, newToast) => {
    actions._add(newToast)
    actions._incrementNextId()
  }),
  remove: action((state, toastId) => {
    state.sessionState.toasts = state.sessionState.toasts.filter((toast) => toast.id !== toastId)
  }),
  removeOldest: action((state) => {
    state.sessionState.toasts.shift()
  }),

  _add: action((state, newToast) => {
    state.sessionState.toasts.push({
      id: state.sessionState.nextId,
      message: newToast.message,
      placement: newToast.placement,
      ...newToast.options,
    })
    console.log(state.sessionState.toasts)
  }),
  _incrementNextId: action((state) => {
    state.sessionState.nextId += 1
  }),
})

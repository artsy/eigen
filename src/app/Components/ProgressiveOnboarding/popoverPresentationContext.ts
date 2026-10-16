import { useEffect, useSyncExternalStore } from "react"

/**
 * Tracks everything currently presented *above* the navigator — RN `<Modal>`s, bottom
 * sheets, camera/Lens overlays.
 *
 * Why this exists: `useIsFocused` only reports navigation focus, and none of the above
 * are navigator screens, so a focused screen stays "focused" while a modal covers it.
 * Popovers are themselves full-screen native Modals, so one presenting on top of
 * another overlay both looks broken and can block touches.
 *
 * It is a module-level store rather than React context so non-React callers (imperative
 * modal helpers) can register too.
 */
const presented = new Set<string>()
const listeners = new Set<() => void>()

const emit = () => listeners.forEach((listener) => listener())

export const registerPresentedOverlay = (id: string) => {
  if (presented.has(id)) {
    return
  }
  presented.add(id)
  emit()
}

export const unregisterPresentedOverlay = (id: string) => {
  if (!presented.delete(id)) {
    return
  }
  emit()
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const getSnapshot = () => presented.size > 0

/** True while anything is presented above the navigator. */
export const useHasPresentedOverlay = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

/**
 * Registers an overlay for as long as it is open, and on unmount.
 *
 * @param id Stable identifier; keep it aligned with the component name.
 * @param isOpen Whether the overlay is currently presented.
 */
export const usePresentedOverlay = (id: string, isOpen: boolean) => {
  useEffect(() => {
    if (!isOpen) {
      return
    }
    registerPresentedOverlay(id)
    return () => unregisterPresentedOverlay(id)
  }, [id, isOpen])
}

/** Test-only: drops all registrations. */
export const __resetPresentedOverlays__ = () => {
  presented.clear()
  emit()
}

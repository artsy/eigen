import { useAuthBottomSheet } from "app/Components/AuthBottomSheet/AuthBottomSheetProvider"
import { AuthIntent } from "app/Components/AuthBottomSheet/AuthBottomSheetTypes"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useCallback } from "react"

interface RequireAuthOptions {
  intent?: AuthIntent
}

/**
 * Wraps a handler so it runs as-is when authenticated, and presents the auth
 * bottom sheet when not. Use for synchronous event handlers (Save, Follow, …).
 *
 * When the logged-out browsing flag is off, this is a pass-through — callers
 * keep their pre-pilot behavior (the handler always runs).
 */
export const useRequireAuth = () => {
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userID)
  const loggedOutEnabled = useFeatureFlag("AREnableLoggedOutMode")
  const { present } = useAuthBottomSheet()

  return useCallback(
    <T extends (...args: any[]) => any>(handler: T, opts?: RequireAuthOptions): T =>
      ((...args: Parameters<T>) => {
        if (isLoggedIn || !loggedOutEnabled) return handler(...args)
        present({ intent: opts?.intent ?? "generic" })
        return undefined
      }) as T,
    [isLoggedIn, loggedOutEnabled, present]
  )
}

/**
 * Imperative guard: returns true if authenticated (or if the logged-out
 * browsing flag is off, preserving pre-pilot behavior), otherwise presents
 * the auth sheet and returns false.
 */
export const useRequireAuthGuard = () => {
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userID)
  const loggedOutEnabled = useFeatureFlag("AREnableLoggedOutMode")
  const { present } = useAuthBottomSheet()

  return useCallback(
    (intent: AuthIntent = "generic"): boolean => {
      if (isLoggedIn || !loggedOutEnabled) return true
      present({ intent })
      return false
    },
    [isLoggedIn, loggedOutEnabled, present]
  )
}

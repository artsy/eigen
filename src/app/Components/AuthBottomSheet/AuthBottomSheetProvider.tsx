import { AuthBottomSheetContent } from "app/Components/AuthBottomSheet/AuthBottomSheetContent"
import {
  AuthBottomSheetPresentOptions,
  AuthIntent,
} from "app/Components/AuthBottomSheet/AuthBottomSheetTypes"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { GlobalStore } from "app/store/GlobalStore"
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

interface AuthBottomSheetContextValue {
  present: (options?: AuthBottomSheetPresentOptions) => void
  dismiss: () => void
}

const AuthBottomSheetContext = createContext<AuthBottomSheetContextValue | null>(null)

// Module-level ref so imperative callers (e.g. navigate()) can present the sheet
// without needing to be inside the React context.
export const authBottomSheetRef: { current: AuthBottomSheetContextValue | null } = {
  current: null,
}

export const presentAuthBottomSheet = (options?: AuthBottomSheetPresentOptions) => {
  authBottomSheetRef.current?.present(options)
}

export const dismissAuthBottomSheet = () => {
  authBottomSheetRef.current?.dismiss()
}

export const AuthBottomSheetProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [visible, setVisible] = useState(false)
  const [intent, setIntent] = useState<AuthIntent>("generic")
  const previousVisibleRef = useRef(false)
  const userID = GlobalStore.useAppState((state) => state.auth.userID)

  const present = useCallback((options?: AuthBottomSheetPresentOptions) => {
    setIntent(options?.intent ?? "generic")
    setVisible(true)
  }, [])

  const dismiss = useCallback(() => {
    setVisible(false)
  }, [])

  const value = useMemo<AuthBottomSheetContextValue>(
    () => ({ present, dismiss }),
    [present, dismiss]
  )

  // // Auto-dismiss when the user becomes authenticated (signIn flips userID).
  useEffect(() => {
    if (visible && userID) {
      setVisible(false)
    }
  }, [userID, visible])

  // Track the previous visible state for the imperative ref consumers.
  useEffect(() => {
    previousVisibleRef.current = visible
  }, [visible])

  // Sync the module-level ref so non-React callers can drive the sheet.
  useEffect(() => {
    authBottomSheetRef.current = value
    return () => {
      if (authBottomSheetRef.current === value) {
        authBottomSheetRef.current = null
      }
    }
  }, [value])

  return (
    <AuthBottomSheetContext.Provider value={value}>
      {children}
      <AutomountedBottomSheetModal visible={visible} onDismiss={dismiss}>
        <AuthBottomSheetContent intent={intent} />
      </AutomountedBottomSheetModal>
    </AuthBottomSheetContext.Provider>
  )
}

export const useAuthBottomSheet = (): AuthBottomSheetContextValue => {
  const ctx = useContext(AuthBottomSheetContext)
  if (!ctx) {
    // Provide a safe no-op fallback so callers don't crash when the provider
    // is absent (e.g. during isolated tests). Real callers should be wrapped
    // by AuthBottomSheetProvider via app/Providers.tsx.
    return {
      present: presentAuthBottomSheet,
      dismiss: dismissAuthBottomSheet,
    }
  }
  return ctx
}

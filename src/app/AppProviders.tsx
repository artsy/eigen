import { ActionSheetProvider } from "@expo/react-native-action-sheet"
import { Spinner, Theme } from "palette"
import React, { Component, ReactNode, Suspense } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { RelayEnvironmentProvider } from "react-relay"
import { _FancyModalPageWrapper } from "./Components/FancyModal/FancyModalContext"
import { PopoverMessageProvider } from "./Components/PopoverMessage/PopoverMessageProvider"
import { RetryErrorBoundary } from "./Components/RetryErrorBoundary"
import { ToastProvider } from "./Components/Toast/toastHook"
import { defaultEnvironment } from "./relay/createEnvironment"
import { GlobalStore, GlobalStoreProvider, useFeatureFlag } from "./store/GlobalStore"
import { combineProviders } from "./utils/combineProviders"
import { UnleashProvider } from "./utils/experiments/UnleashProvider"
import { track } from "./utils/track"
import { ProvideScreenDimensions } from "./utils/useScreenDimensions"

export const AppProviders = ({ children }: { children?: ReactNode }) =>
  combineProviders(
    [
      // order matters here, be careful!
      // if Provider A is using another Provider B, then A needs to appear below B.
      TrackingProvider,
      GlobalStoreProvider,
      UnleashProvider, // uses: GlobalStoreProvider
      SafeAreaProvider,
      ProvideScreenDimensions, // uses: SafeAreaProvider
      RelayDefaultEnvProvider,
      ThemeProvider, // uses: GlobalStoreProvider
      RetryErrorBoundary,
      SuspenseProvider,
      ActionSheetProvider,
      PopoverMessageProvider,
      _FancyModalPageWrapper,
      ToastProvider, // uses: GlobalStoreProvider
    ],
    children
  )

// Providers with preset props

// relay needs the default environment
const RelayDefaultEnvProvider = (props: { children?: ReactNode }) => (
  <RelayEnvironmentProvider environment={defaultEnvironment} {...props} />
)

const SuspenseProvider = (props: { children?: ReactNode }) => (
  <Suspense fallback={<Spinner />} {...props} />
)

// react-track has no provider, we make one using the decorator and a class wrapper
const TrackingProvider = (props: { children?: ReactNode }) => <PureWrapper {...props} />

@track()
class PureWrapper extends Component {
  render() {
    return this.props.children
  }
}

// theme with dark mode support
function ThemeProvider({ children }: { children?: ReactNode }) {
  const supportDarkMode = useFeatureFlag("ARDarkModeSupport")
  const darkMode = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme)

  return (
    <Theme theme={supportDarkMode ? (darkMode === "dark" ? "v5dark" : "v5") : undefined}>
      {children}
    </Theme>
  )
}

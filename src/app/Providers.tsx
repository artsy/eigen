import { ActionSheetProvider } from "@expo/react-native-action-sheet"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { Spinner, Theme } from "palette"
import { Component, Suspense } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { RelayEnvironmentProvider } from "react-relay"
import { ProvideScreenDimensions } from "shared/hooks"
import { _FancyModalPageWrapper } from "./Components/FancyModal/FancyModalContext"
import { PopoverMessageProvider } from "./Components/PopoverMessage/PopoverMessageProvider"
import { RetryErrorBoundary } from "./Components/RetryErrorBoundary"
import { ToastProvider } from "./Components/Toast/toastHook"
import { GlobalStore, GlobalStoreProvider, useFeatureFlag } from "./store/GlobalStore"
import { GravityWebsocketContextProvider } from "./utils/Websockets/GravityWebsocketContext"
import { combineProviders } from "./utils/combineProviders"
import { UnleashProvider } from "./utils/experiments/UnleashProvider"
import { track } from "./utils/track"

export const Providers = ({
  children,
  skipGestureHandler = false,
  skipUnleash = false,
  skipFancyModal = false,
  skipActionSheet = false,
  skipSuspense = false,
  skipWebsocket = false,
  skipRetryErrorBoundary = false,
  skipRelay = false,
  simpleTheme = false,
}: {
  children?: React.ReactNode
  skipGestureHandler?: boolean
  skipUnleash?: boolean
  skipFancyModal?: boolean
  skipActionSheet?: boolean
  skipSuspense?: boolean
  skipWebsocket?: boolean
  skipRetryErrorBoundary?: boolean
  skipRelay?: boolean
  simpleTheme?: boolean
}) =>
  combineProviders(
    [
      // order matters here, be careful!
      // if Provider A is using another Provider B, then A needs to appear below B.
      !skipGestureHandler && GestureHandlerProvider,
      TrackingProvider,
      GlobalStoreProvider,
      !skipUnleash && UnleashProvider, // uses: GlobalStoreProvider
      SafeAreaProvider,
      ProvideScreenDimensions, // uses: SafeAreaProvider
      !skipRelay && RelayDefaultEnvProvider,
      simpleTheme ? Theme : ThemeProvider, // uses: GlobalStoreProvider
      !skipRetryErrorBoundary && RetryErrorBoundary,
      !skipSuspense && SuspenseProvider,
      !skipActionSheet && ActionSheetProvider,
      PopoverMessageProvider,
      !skipFancyModal && _FancyModalPageWrapper,
      ToastProvider, // uses: GlobalStoreProvider
      !skipWebsocket && GravityWebsocketContextProvider, // uses GlobalStoreProvider
    ],
    children
  )

// Providers with preset props

const GestureHandlerProvider = (props: { children?: React.ReactNode }) => (
  <GestureHandlerRootView style={{ flex: 1 }} {...props} />
)

const RelayDefaultEnvProvider = (props: { children?: React.ReactNode }) => (
  <RelayEnvironmentProvider environment={getRelayEnvironment()} {...props} />
)

const SuspenseProvider = (props: { children?: React.ReactNode }) => (
  <Suspense fallback={<Spinner />} {...props} />
)

// react-track has no provider, we make one using the decorator and a class wrapper
const TrackingProvider = (props: { children?: React.ReactNode }) => <PureWrapper {...props} />

@track()
class PureWrapper extends Component {
  render() {
    return this.props.children
  }
}

// theme with dark mode support
function ThemeProvider({ children }: { children?: React.ReactNode }) {
  const supportDarkMode = useFeatureFlag("ARDarkModeSupport")
  const darkMode = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme)

  return (
    <Theme theme={supportDarkMode ? (darkMode === "dark" ? "v5dark" : "v5") : undefined}>
      {children}
    </Theme>
  )
}

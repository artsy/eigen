import { Theme, Spinner, ScreenDimensionsProvider } from "@artsy/palette-mobile"
import { ActionSheetProvider } from "@expo/react-native-action-sheet"
import { ShareSheetProvider } from "app/Components/ShareSheet/ShareSheetContext"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ProvideScreenDimensions } from "app/utils/hooks/useScreenDimensions"
import { Component, Suspense } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { RelayEnvironmentProvider } from "react-relay"
import { _FancyModalPageWrapper } from "./Components/FancyModal/FancyModalContext"
import { PopoverMessageProvider } from "./Components/PopoverMessage/PopoverMessageProvider"
import { RetryErrorBoundary } from "./Components/RetryErrorBoundary"
import { ToastProvider } from "./Components/Toast/toastHook"
import { GlobalStore, GlobalStoreProvider } from "./store/GlobalStore"
import { GravityWebsocketContextProvider } from "./utils/Websockets/GravityWebsocketContext"
import { combineProviders } from "./utils/combineProviders"
import { UnleashProvider } from "./utils/experiments/UnleashProvider"
import { track } from "./utils/track"

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) =>
  combineProviders(
    [
      // If Provider A is using another Provider B, then A needs to appear below B.
      GestureHandlerProvider,
      TrackingProvider,
      GlobalStoreProvider,
      UnleashProvider, // uses: GlobalStoreProvider
      SafeAreaProvider,
      ProvideScreenDimensions, // uses: SafeAreaProvider
      // FIXME: Only use one from palette-mobile
      // @ts-ignore
      ScreenDimensionsProvider,
      RelayDefaultEnvProvider,
      ThemeWithDarkModeSupport, // uses: GlobalStoreProvider
      RetryErrorBoundary,
      SuspenseProvider,
      ActionSheetProvider,
      PopoverMessageProvider,
      _FancyModalPageWrapper,
      ToastProvider, // uses: GlobalStoreProvider
      GravityWebsocketContextProvider, // uses GlobalStoreProvider
      ShareSheetProvider, // uses _FancyModalPageWrapper
    ],
    children
  )

export const TestProviders: React.FC<{ skipRelay?: boolean }> = ({
  children,
  skipRelay = false,
}) => {
  return combineProviders(
    [
      TrackingProvider,
      GlobalStoreProvider,
      SafeAreaProvider,
      ProvideScreenDimensions,
      // FIXME: Only use one from palette-mobile
      // @ts-ignore
      ScreenDimensionsProvider,
      !skipRelay && RelayDefaultEnvProvider,
      Theme,
      PopoverMessageProvider,
      ShareSheetProvider,
      ToastProvider,
    ],
    children
  )
}

// Providers with preset props

const GestureHandlerProvider = (props: { children?: React.ReactNode }) => (
  <GestureHandlerRootView style={{ flex: 1 }} {...props} />
)

const RelayDefaultEnvProvider = (props: { children?: React.ReactNode }) => (
  <RelayEnvironmentProvider environment={getRelayEnvironment()}>
    {props.children}
  </RelayEnvironmentProvider>
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
function ThemeWithDarkModeSupport({ children }: { children?: React.ReactNode }) {
  const supportDarkMode = useFeatureFlag("ARDarkModeSupport")
  const darkMode = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme)

  return (
    <Theme theme={supportDarkMode ? (darkMode === "dark" ? "v3dark" : "v3light") : undefined}>
      {children}
    </Theme>
  )
}

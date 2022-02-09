import { ActionSheetProvider } from "@expo/react-native-action-sheet"
import { Theme } from "palette"
import React, { Component, ComponentClass, FC, ReactNode } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { RelayEnvironmentProvider } from "react-relay"
import { _FancyModalPageWrapper } from "./Components/FancyModal/FancyModalContext"
import { PopoverMessageProvider } from "./Components/PopoverMessage/PopoverMessageProvider"
import { RetryErrorBoundary } from "./Components/RetryErrorBoundary"
import { ToastProvider } from "./Components/Toast/toastHook"
import { defaultEnvironment } from "./relay/createEnvironment"
import { GlobalStoreProvider } from "./store/GlobalStore"
import { ProvideScreenDimensions } from "./utils/useScreenDimensions"
import { combineProviders } from "./utils/combineProviders"
import track from "react-tracking"

export const AppProviders = ({ children }: { children?: ReactNode }) =>
  combineProviders(
    [
      // order matters here, be careful!
      // if Provider A is using another Provider B, then A needs to appear below B.
      TrackingProvider,
      SafeAreaProvider,
      ProvideScreenDimensions, // uses: SafeAreaProvider
      GlobalStoreProvider,
      RelayDefaultEnvProvider,
      Theme,
      RetryErrorBoundary,
      ActionSheetProvider,
      PopoverMessageProvider,
      _FancyModalPageWrapper,
      ToastProvider, // uses: GlobalStoreProvider
    ],
    children
  )

// Providers with preset props

// relay needs the default environment
const RelayDefaultEnvProvider: FC = (props) => (
  <RelayEnvironmentProvider environment={defaultEnvironment} {...props} />
)

// react-track has no provider, we make one using the decorator and a class wrapper
const TrackingProvider: FC = (props) => <PureWrapper {...props} />

@track()
class PureWrapper extends Component {
  render() {
    return this.props.children
  }
}

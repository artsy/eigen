import { render } from "@testing-library/react-native"
import { PopoverMessageProvider } from "app/Components/PopoverMessage/PopoverMessageProvider"
import { ToastProvider } from "app/Components/Toast/toastHook"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { GlobalStoreProvider } from "app/store/GlobalStore"
import { combineProviders } from "app/utils/combineProviders"
import { track } from "app/utils/track"
import { Text, Theme } from "palette"
import { Component, Suspense } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { RelayEnvironmentProvider } from "react-relay"
import ReactTestRenderer from "react-test-renderer"
import { ProvideScreenDimensions } from "shared/hooks"
import { ReactElement } from "simple-markdown"

const Wrappers: React.FC = ({ children }) =>
  combineProviders(
    [
      TrackingProvider,
      GlobalStoreProvider,
      SafeAreaProvider,
      ProvideScreenDimensions, // uses: SafeAreaProvider
      Theme, // uses: GlobalStoreProvider
      PopoverMessageProvider,
      ToastProvider, // uses: GlobalStoreProvider
    ],
    children
  )

/**
 * Returns given component wrapped with our page wrappers
 * @param component
 */
const componentWithWrappers = (component: ReactElement) => {
  return <Wrappers>{component}</Wrappers>
}

/**
 * @deprecated
 * Use `renderWithWrappers` instead.
 *
 * Renders a React Component with our page wrappers
 * @param component
 */
export const renderWithWrappersLEGACY = (component: ReactElement) => {
  const wrappedComponent = componentWithWrappers(component)
  try {
    // tslint:disable-next-line:use-wrapped-components
    const renderedComponent = ReactTestRenderer.create(wrappedComponent)

    // monkey patch update method to wrap components
    const originalUpdate = renderedComponent.update
    renderedComponent.update = (nextElement: ReactElement) => {
      originalUpdate(componentWithWrappers(nextElement))
    }

    return renderedComponent
  } catch (error: any) {
    if (error.message.includes("Element type is invalid")) {
      throw new Error(
        "Error: Relay test component failed to render. This may happen if you forget to add `` at the top " +
          "of your test? or if the module you are testing is getting mocked in setupJest.ts" +
          "\n\n" +
          error
      )
    } else {
      throw new Error(error.stack)
    }
  }
}

// react-track has no provider, we make one using the decorator and a class wrapper
export const TrackingProvider = (props: { children?: React.ReactNode }) => (
  <PureWrapper {...props} />
)

@track()
class PureWrapper extends Component {
  render() {
    return this.props.children
  }
}

/**
 * Renders a React Component with our page wrappers
 * by using @testing-library/react-native
 * @param component
 */
export const renderWithWrappers = (component: ReactElement) => {
  try {
    return render(component, { wrapper: Wrappers })
  } catch (error: any) {
    if (error.message.includes("Element type is invalid")) {
      throw new Error(
        "Error: Relay test component failed to render. This may happen if you forget to add `` at the top " +
          "of your test? or if the module you are testing is getting mocked in setupJest.ts" +
          "\n\n" +
          error
      )
    } else if (error.message.includes("was rendered outside of a query renderer")) {
      throw new Error(
        "Error: Relay test component failed to render. Your test could need a query renderer to pass.\n" +
          "Try wrapping your test with `renderWithRelayWrappers`" +
          "\n\n" +
          error
      )
    } else {
      throw new Error(error.stack)
    }
  }
}

export const renderWithRelayWrappers = (component: ReactElement) =>
  renderWithWrappers(
    <RelayEnvironmentProvider environment={getRelayEnvironment()}>
      <Suspense fallback={<Text>TEST-SUSPENSE-LOADING</Text>}>{component}</Suspense>
    </RelayEnvironmentProvider>
  )

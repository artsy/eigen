import { render } from "@testing-library/react-native"
import { Providers } from "app/Providers"
import { defaultEnvironment } from "app/system/relay/createEnvironment"
import { track } from "app/utils/track"
import { Component, Suspense } from "react"
import { Environment, RelayEnvironmentProvider } from "react-relay"
import ReactTestRenderer from "react-test-renderer"
import { ReactElement } from "simple-markdown"

const Wrappers = ({ children }: { children: React.ReactNode }) => (
  <Providers
    skipGestureHandler
    skipUnleash
    skipFancyModal
    skipActionSheet
    simpleTheme
    skipSuspense
    skipWebsocket
  >
    {children}
  </Providers>
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
    const renderedComponent = ReactTestRenderer.create(wrappedComponent)

    // monkey patch update method to wrap components
    const originalUpdate = renderedComponent.update
    renderedComponent.update = (nextElement: ReactElement) => {
      originalUpdate(componentWithWrappers(nextElement))
    }

    return renderedComponent
  } catch (error: any) {
    throw new Error(error.stack)
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
    throw new Error(error.stack)
  }
}

export const renderWithHookWrappersTL = (
  component: ReactElement,
  environment: Environment = defaultEnvironment
) => {
  const jsx = (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback="Loading...">{component}</Suspense>
    </RelayEnvironmentProvider>
  )
  return renderWithWrappers(jsx)
}

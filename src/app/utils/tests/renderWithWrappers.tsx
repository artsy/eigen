import { render, RenderOptions } from "@testing-library/react-native"
import { TestProviders } from "app/Providers"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { Suspense } from "react"
import { Environment, RelayEnvironmentProvider } from "react-relay"
import ReactTestRenderer from "react-test-renderer"
import { ReactElement } from "simple-markdown"

export interface WrappersProps {
  skipRelay?: boolean
  includeNavigation?: boolean
  includeArtworkLists?: boolean
}

const Wrappers: React.FC<React.PropsWithChildren<WrappersProps>> = ({
  skipRelay,
  includeNavigation,
  includeArtworkLists,
  children,
}) => {
  return (
    <TestProviders
      includeNavigation={includeNavigation}
      includeArtworkLists={includeArtworkLists}
      skipRelay={skipRelay}
    >
      {children}
    </TestProviders>
  )
}

/**
 * Returns given component wrapped with our page wrappers
 * @param component
 */
const componentWithWrappers = (component: ReactElement) => {
  return <Wrappers>{component}</Wrappers>
}

/**
 * @deprecated Use `renderWithWrappers` instead.
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

/**
 * Renders a React Component with our page wrappers
 * by using @testing-library/react-native
 * IMPORTANT: It is meant to be used for non-Relay components
 *
 * @param component
 */
export const renderWithWrappers = (component: ReactElement, wrapperProps?: WrappersProps) => {
  try {
    const wrapper = (props: RenderOptions["wrapper"]) => {
      return <Wrappers {...wrapperProps} {...props} />
    }

    return render(component, { wrapper })
  } catch (error: any) {
    throw new Error(error.stack)
  }
}

/**
 * @deprecated Use `setupTestWrapper` instead.
 *
 */
export const renderWithHookWrappersTL = (
  component: ReactElement,
  environment: Environment = getRelayEnvironment(),
  wrapperProps?: WrappersProps
) => {
  const jsx = (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback="Loading...">{component}</Suspense>
    </RelayEnvironmentProvider>
  )
  return renderWithWrappers(jsx, wrapperProps)
}

import { render, RenderOptions } from "@testing-library/react-native"
import { TestProviders } from "app/Providers"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { ReactElement, Suspense } from "react"
import { Text } from "react-native"
import { Environment, RelayEnvironmentProvider } from "react-relay"

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
      <Suspense fallback={<Text>Loading...</Text>}>{component}</Suspense>
    </RelayEnvironmentProvider>
  )
  return renderWithWrappers(jsx, wrapperProps)
}

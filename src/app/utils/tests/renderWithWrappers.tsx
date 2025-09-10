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
    let renderedComponent: ReactTestRenderer.ReactTestRenderer | undefined

    // React 19 requires ReactTestRenderer.create to be wrapped in act
    ReactTestRenderer.act(() => {
      renderedComponent = ReactTestRenderer.create(wrappedComponent)
    })

    if (!renderedComponent) {
      throw new Error("Failed to create test renderer")
    }

    // monkey patch update method to wrap components
    const originalUpdate = renderedComponent.update
    renderedComponent.update = (nextElement: ReactElement) => {
      ReactTestRenderer.act(() => {
        originalUpdate(componentWithWrappers(nextElement))
      })
    }

    return renderedComponent
  } catch (error: any) {
    throw new Error(error.stack)
  }
}

/**
 * Enhanced version of renderWithWrappersLEGACY that provides utilities for React 19 compatibility.
 * Use this when you need to wait for async operations like Relay mock resolutions.
 * 
 * @param component - The React component to render
 * @returns An object with the rendered component and helper methods
 */
export const renderWithWrappersLEGACYAsync = (component: ReactElement) => {
  const renderedComponent = renderWithWrappersLEGACY(component)
  
  return {
    ...renderedComponent,
    
    /**
     * Wait for async operations to complete, then execute a callback with access to the root
     * @param callback - Function that receives the root and can make assertions
     * @param timeout - Optional timeout in ms (default: 5000)
     */
    waitForAsync: async <T = void>(
      callback: (root: ReactTestRenderer.ReactTestInstance) => T | Promise<T>,
      timeout: number = 5000
    ): Promise<T> => {
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error(`waitForAsync timed out after ${timeout}ms`))
        }, timeout)

        const tryCallback = async () => {
          try {
            // Give React time to process updates
            await new Promise(resolve => setTimeout(resolve, 0))
            const result = await callback(renderedComponent.root)
            clearTimeout(timeoutId)
            resolve(result)
          } catch (error) {
            // Retry if the callback fails (element not found yet)
            if (error instanceof Error && error.message.includes('Unable to find')) {
              setTimeout(tryCallback, 10)
            } else {
              clearTimeout(timeoutId)
              reject(error)
            }
          }
        }

        tryCallback()
      })
    },

    /**
     * Wait for a specific number of elements of a given type to appear
     * @param elementType - The component type to find
     * @param expectedCount - Expected number of elements
     * @param timeout - Optional timeout in ms (default: 5000)
     */
    waitForElements: async (
      elementType: React.ComponentType<any> | string,
      expectedCount: number,
      timeout: number = 5000
    ): Promise<ReactTestRenderer.ReactTestInstance[]> => {
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error(`waitForElements timed out after ${timeout}ms waiting for ${expectedCount} elements of type ${elementType}`))
        }, timeout)

        const checkElements = async () => {
          try {
            // Give React time to process updates
            await new Promise(resolve => setTimeout(resolve, 0))
            const elements = renderedComponent.root.findAllByType(elementType as any)
            if (elements.length === expectedCount) {
              clearTimeout(timeoutId)
              resolve(elements)
            } else {
              setTimeout(checkElements, 10)
            }
          } catch (error) {
            setTimeout(checkElements, 10)
          }
        }

        checkElements()
      })
    }
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

import { ToastProvider } from "lib/Components/Toast/toastHook"
import { GlobalStoreProvider } from "lib/store/GlobalStore"
import { Theme } from "palette"
import React from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import ReactTestRenderer from "react-test-renderer"
import { ReactElement } from "simple-markdown"

/**
 * Renders a React Component with our page wrappers
 * @param component
 */
export const renderWithWrappers = (component: ReactElement) => {
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
  } catch (error) {
    if (error.message.includes("Element type is invalid")) {
      throw new Error(
        'Error: Relay test component failed to render. This may happen if you forget to add `jest.unmock("react-relay")` at the top ' +
          "of your test? or if the module you are testing is getting mocked in setup.js" +
          "\n\n" +
          error
      )
    } else {
      throw new Error(error.stack)
    }
  }
}

/**
 * Returns given component wrapped with our page wrappers
 * @param component
 */
export const componentWithWrappers = (component: ReactElement) => <TestWrappers>{component}</TestWrappers>

export const TestWrappers: React.FC = (props) => (
  <GlobalStoreProvider>
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 380, height: 550 },
        insets: { top: 20, left: 0, right: 0, bottom: 0 },
      }}
    >
      <Theme>
        <ToastProvider>{props.children}</ToastProvider>
      </Theme>
    </SafeAreaProvider>
  </GlobalStoreProvider>
)

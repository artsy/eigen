import { render } from "@testing-library/react-native"
import { ToastProvider } from "lib/Components/Toast/toastHook"
import { GlobalStoreProvider } from "lib/store/GlobalStore"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import { Theme } from "palette"
import React from "react"
import ReactTestRenderer from "react-test-renderer"
import { ReactElement } from "simple-markdown"

export const Wrappers: React.FC = ({ children }) => {
  return (
    <GlobalStoreProvider>
      <Theme>
        <ToastProvider>
          <ProvideScreenDimensions>{children}</ProvideScreenDimensions>
        </ToastProvider>
      </Theme>
    </GlobalStoreProvider>
  )
}

/**
 * Returns given component wrapped with our page wrappers
 * @param component
 */
export const componentWithWrappers = (component: ReactElement) => {
  return <Wrappers>{component}</Wrappers>
}

/**
 * Renders a React Component with our page wrappers
 * @param component
 * @deprecated Try to use `renderWithWrappers`. If there is any problem and this function works, please report it to CX.
 */
export const renderWithWrappers_legacy = (component: ReactElement) => {
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
 * Renders a React Component with our page wrappers
 * @param component
 */
export const renderWithWrappers = (component: ReactElement) => {
  return render(component, { wrapper: Wrappers })
}

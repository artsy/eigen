import { render } from "@testing-library/react-native"
import { PopoverMessageProvider } from "lib/Components/PopoverMessage/PopoverMessageProvider"
import { ToastProvider } from "lib/Components/Toast/toastHook"
import { GlobalStoreProvider } from "lib/store/GlobalStore"
import { track } from "lib/utils/track"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import { Theme } from "palette"
import React from "react"
import ReactTestRenderer from "react-test-renderer"

export const Wrappers: React.FC = ({ children }) => {
  return (
    <TrackProvider>
      <GlobalStoreProvider>
        <Theme>
          <ToastProvider>
            <PopoverMessageProvider>
              <ProvideScreenDimensions>{children}</ProvideScreenDimensions>
            </PopoverMessageProvider>
          </ToastProvider>
        </Theme>
      </GlobalStoreProvider>
    </TrackProvider>
  )
}

/**
 * Returns given component wrapped with our page wrappers
 * @param component
 */
export const componentWithWrappers = (component: React.ReactElement) => {
  return <Wrappers>{component}</Wrappers>
}

/**
 * Renders a React Component with our page wrappers
 * @param component
 */
export const renderWithWrappers = (component: React.ReactElement) => {
  const wrappedComponent = componentWithWrappers(component)
  try {
    // tslint:disable-next-line:use-wrapped-components
    const renderedComponent = ReactTestRenderer.create(wrappedComponent)

    // monkey patch update method to wrap components
    const originalUpdate = renderedComponent.update
    renderedComponent.update = (nextElement: React.ReactElement) => {
      originalUpdate(componentWithWrappers(nextElement))
    }

    return renderedComponent
  } catch (error) {
    if (error.message.includes("Element type is invalid")) {
      throw new Error(
        'Error: Relay test component failed to render. This may happen if you forget to add `jest.unmock("react-relay")` at the top ' +
          "of your test? or if the module you are testing is getting mocked in setupJest.ts" +
          "\n\n" +
          error
      )
    } else {
      throw new Error(error.stack)
    }
  }
}

export const TrackProvider = track()(({ children }: { children?: React.ReactNode }) => {
  return <>{children}</>
})

/**
 * Renders a React Component with our page wrappers
 * by using @testing-library/react-native
 * @param component
 */
export const renderWithWrappersTL = (component: React.ReactElement) => {
  const result = render(component, { wrapper: Wrappers })

  const container = result.UNSAFE_getByType(component.type as any)

  return {
    ...result, // return all the regular helpers we get from @testing-library
    containerWithWrappers: result.container, // return the whole tree, wrappers and all
    container, // return a tree starting from the component that we give to `renderWithWrappersTL`
  }
}

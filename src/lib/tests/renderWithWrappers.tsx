import { render } from "@testing-library/react-native"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import { ToastProvider } from "lib/Components/Toast/toastHook"
import { GlobalStoreProvider } from "lib/store/GlobalStore"
import { track } from "lib/utils/track"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import { Theme } from "palette"
import React from "react"
import ReactTestRenderer from "react-test-renderer"
import { ReactElement } from "simple-markdown"

/**
 * Renders a React Component with our wrappers.
 * @param component
 */
export const renderWithWrappersTL = (component: ReactElement) => {
  const root = render(component, { wrapper: Wrappers })
  return {
    ...root,
    getByType: root.UNSAFE_getByType,
    getAllByType: root.UNSAFE_getAllByType,
  }
}

/**
 * Renders a React Component with our wrappers.
 * @param component
 * @deprecated Prefer `renderWithWrappersTL`.
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
          "of your test? or if the module you are testing is getting mocked in setupJest.ts" +
          "\n\n" +
          error
      )
    } else {
      throw new Error(error.stack)
    }
  }
}
export const componentWithWrappers = (component: ReactElement) => <Wrappers>{component}</Wrappers>

/**
 * Mounts a React Component with our wrappers.
 * @param component
 * @deprecated Prefer `renderWithWrappersTL`.
 */
// tslint:disable-next-line:variable-name
export const __deprecated_mountWithWrappers = (component: ReactElement) => {
  return mount(componentWithWrappers(component))
}

export const TrackProvider = track()(({ children }: { children?: React.ReactNode }) => {
  return <>{children}</>
})

export const Wrappers = ({ children }: { children: React.ReactNode }) => (
  <TrackProvider>
    <ProvideScreenDimensions>
      <Theme>
        <GlobalStoreProvider>
          <ToastProvider>{children}</ToastProvider>
        </GlobalStoreProvider>
      </Theme>
    </ProvideScreenDimensions>
  </TrackProvider>
)

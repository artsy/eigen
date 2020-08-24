import { Theme } from "@artsy/palette"
import { AppStoreProvider } from "lib/store/AppStore"
import React from "react"
import ReactTestRenderer from "react-test-renderer"
import { ReactElement } from "simple-markdown"

/**
 * Renders a React Component with our page wrappers
 * only <Theme> for now
 * @param component
 */
export const renderWithWrappers = (component: ReactElement) => {
  const wrappedComponent = componentWithWrappers(component)
  // tslint:disable-next-line:use-wrapped-components
  const renderedComponent = ReactTestRenderer.create(wrappedComponent)

  // monkey patch update method to wrap components
  const originalUpdate = renderedComponent.update
  renderedComponent.update = (nextElement: ReactElement) => {
    originalUpdate(componentWithWrappers(nextElement))
  }

  return renderedComponent
}

/**
 * Returns given component wrapped with our page wrappers
 * only <Theme> for now
 * @param component
 */
export const componentWithWrappers = (component: ReactElement) => {
  return (
    <AppStoreProvider>
      <Theme>{component}</Theme>
    </AppStoreProvider>
  )
}

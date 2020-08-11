import { Theme } from "@artsy/palette"
import React from "react"
import ReactTestRenderer from "react-test-renderer"
import { ReactElement } from "simple-markdown"

/*
 * Renders a React Component with our page wrappers
 * only <Theme> for now
 */
export const renderWithWrappers = (component: ReactElement) => {
  const wrappedComponent = <Theme>{component}</Theme>
  // tslint:disable-next-line:use-wrapped-components
  const renderedComponent = ReactTestRenderer.create(wrappedComponent)
  return renderedComponent
}

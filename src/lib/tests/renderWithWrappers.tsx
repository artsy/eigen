import { Theme } from "@artsy/palette"
import React from "react"
import * as renderer from "react-test-renderer"
import { ReactElement } from "simple-markdown"

/*
 * Renders a React Component with our page wrappers
 * only <Theme> for now
 */
export const renderWithWrappers = (component: ReactElement) => {
  const wrappedComponent = <Theme>{component}</Theme>
  const renderedComponent = renderer.create(wrappedComponent)
  return renderedComponent
}

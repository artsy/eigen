import React from "react"
import "react-native"

import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { StickyTabPage } from "../StickyTabPage/StickyTabPage"
import About from "./About"

it("renders without throwing a error", () => {
  const tag = {
    description: `Handmade Paper is very nice`,
  }

  renderWithWrappers(
    <StickyTabPage
      tabs={[
        {
          title: "test",
          content: <About tag={tag as any} />,
        },
      ]}
    />
  )
})

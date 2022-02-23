import "react-native"

import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"

import Metadata from "./Metadata"

it("renders properly", () => {
  const show = {
    kind: "solo",
    name: "Expansive Exhibition",
    exhibition_period: "Jan 1 - March 1",
    status_update: "Closing in 2 days",
    status: "running",
    partner: {
      name: "Gallery",
    },
    location: {
      city: "Berlin",
    },
  }
  renderWithWrappers(<Metadata show={show as any} />)
})

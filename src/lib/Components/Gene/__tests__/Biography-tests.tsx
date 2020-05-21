import "react-native"

import React from "react"
import * as renderer from "react-test-renderer"

import { BiographyContainer } from "../Biography"

import { Theme } from "@artsy/palette"

it("renders without throwing a error", () => {
  const gene = {
    description: "Watercolor painting is very nice",
  }
  renderer.create(
    <Theme>
      <BiographyContainer gene={gene as any} />
    </Theme>
  )
})

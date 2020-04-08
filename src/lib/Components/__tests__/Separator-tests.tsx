import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import Separator from "../Separator"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  renderer.create(
    <Theme>
      <Separator />
    </Theme>
  )
})

import { Theme } from "@artsy/palette"
import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import LoadingModal from "../LoadingModal"

describe("LoadingModal", () => {
  it("renders without throwing when invisible", () => {
    renderer.create(
      <Theme>
        <LoadingModal isVisible={false} />
      </Theme>
    )
  })

  it("renders without throwing when visible", () => {
    renderer.create(
      <Theme>
        <LoadingModal isVisible={false} />
      </Theme>
    )
  })
})

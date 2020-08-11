import { Theme } from "@artsy/palette"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import LoadingModal from "../LoadingModal"

describe("LoadingModal", () => {
  it("renders without throwing when invisible", () => {
    renderWithWrappers(
      <Theme>
        <LoadingModal isVisible={false} />
      </Theme>
    )
  })

  it("renders without throwing when visible", () => {
    renderWithWrappers(
      <Theme>
        <LoadingModal isVisible={false} />
      </Theme>
    )
  })
})

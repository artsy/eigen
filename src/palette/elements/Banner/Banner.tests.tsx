import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Banner } from "./Banner"

describe("Banner", () => {
  it("it renders", () => {
    const BannerComponent = renderWithWrappers(<Banner title="title" text="text" />)

    expect(BannerComponent).toBeTruthy()
  })
})

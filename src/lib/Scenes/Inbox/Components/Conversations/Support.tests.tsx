import { render } from "@testing-library/react-native"
import { Theme } from "palette"
import React from "react"
import { Support } from "./Support"

describe("Support", () => {
  it("render", () => {
    const { getByText } = render(
      <Theme>
        <Support />
      </Theme>
    )

    expect(getByText("Support")).toBeDefined()
    expect(getByText("Inquiries FAQ")).toBeDefined()
  })
})

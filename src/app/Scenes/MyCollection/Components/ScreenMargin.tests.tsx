import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { ScreenMargin } from "./ScreenMargin"

describe("Navigator", () => {
  it("renders child components", () => {
    const Noop: React.FC = () => null
    const wrapper = renderWithWrappers(
      <ScreenMargin>
        <Noop />
      </ScreenMargin>
    )
    expect(wrapper.root.findByType(Noop)).toBeDefined()
  })
})

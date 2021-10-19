import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
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

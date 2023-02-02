import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { ScreenMargin } from "./ScreenMargin"

describe("Navigator", () => {
  it("renders child components", () => {
    const Noop: React.FC = () => null
    const wrapper = renderWithWrappersLEGACY(
      <ScreenMargin>
        <Noop />
      </ScreenMargin>
    )
    expect(wrapper.root.findByType(Noop)).toBeDefined()
  })
})

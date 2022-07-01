import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { ArrowRightIcon } from "palette"
import { View } from "react-native"
import { ArrowDetails } from "./ArrowDetails"

describe("ArrowDetails", () => {
  it("renders correct components", () => {
    const Noop: React.FC = () => <View />
    const wrapper = renderWithWrappersLEGACY(
      <ArrowDetails>
        <Noop />
      </ArrowDetails>
    )
    expect(wrapper.root.findByType(Noop)).toBeDefined()
    expect(wrapper.root.findByType(ArrowRightIcon)).toBeDefined()
  })
})

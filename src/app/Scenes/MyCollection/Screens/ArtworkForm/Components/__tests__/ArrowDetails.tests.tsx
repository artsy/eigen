import { ChevronRightIcon } from "@artsy/icons/native"
import { ArrowDetails } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArrowDetails"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { View } from "react-native"

describe("ArrowDetails", () => {
  it("renders correct components", () => {
    const Noop: React.FC = () => <View />
    const wrapper = renderWithWrappersLEGACY(
      <ArrowDetails>
        <Noop />
      </ArrowDetails>
    )
    expect(wrapper.root.findByType(Noop)).toBeDefined()
    expect(wrapper.root.findByType(ChevronRightIcon)).toBeDefined()
  })
})

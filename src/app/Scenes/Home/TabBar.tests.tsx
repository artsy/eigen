import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { Animated } from "react-native"

import TabBar from "app/Components/TabBar"

it("renders without throwing an error", () => {
  renderWithWrappersLEGACY(
    <TabBar tabs={["Page 1", "Page 2", "Page 3"]} scrollValue={new Animated.Value(0)} />
  )
})

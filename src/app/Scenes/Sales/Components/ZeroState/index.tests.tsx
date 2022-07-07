import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import "react-native"
import { ZeroState } from "./index"

it("renders without throwing an error", () => {
  renderWithWrappersLEGACY(<ZeroState />)
})

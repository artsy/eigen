import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import "react-native"
import ConnectivityBanner from "app/Components/ConnectivityBanner"

it("renders without throwing an error", () => {
  renderWithWrappersLEGACY(<ConnectivityBanner />)
})

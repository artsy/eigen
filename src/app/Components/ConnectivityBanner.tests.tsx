import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import "react-native"
import ConnectivityBanner from "./ConnectivityBanner"

it("renders without throwing an error", () => {
  renderWithWrappersLEGACY(<ConnectivityBanner />)
})

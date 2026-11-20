import { screen } from "@testing-library/react-native"
import ConnectivityBanner from "app/Components/ConnectivityBanner"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

it("renders without throwing an error", () => {
  renderWithWrappers(<ConnectivityBanner />)

  expect(screen.getByText("No Internet Connection")).toBeOnTheScreen()
})

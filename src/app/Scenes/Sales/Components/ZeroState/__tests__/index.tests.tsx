import { screen } from "@testing-library/react-native"
import { ZeroState } from "app/Scenes/Sales/Components/ZeroState/index"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

it("renders without throwing an error", () => {
  renderWithWrappers(<ZeroState />)

  expect(screen.getByText("Auctions")).toBeOnTheScreen()
  expect(screen.getByText("There are no upcoming auctions scheduled")).toBeOnTheScreen()
  expect(screen.getByText("Check back soon for new auctions on Artsy.")).toBeOnTheScreen()
})

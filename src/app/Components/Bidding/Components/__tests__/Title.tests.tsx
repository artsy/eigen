import { screen } from "@testing-library/react-native"
import { Title } from "app/Components/Bidding/Components/Title"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

it("renders without throwing an error", () => {
  renderWithWrappers(<Title>Confirm your bid</Title>)

  expect(screen.getByText("Confirm your bid")).toBeOnTheScreen()
})

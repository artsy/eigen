import { screen } from "@testing-library/react-native"
import Biography from "app/Components/Gene/Biography"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

it("renders without throwing a error", () => {
  const gene = {
    description: "Watercolor painting is very nice",
  }
  renderWithWrappers(<Biography gene={gene as any} />)

  expect(screen.getByText("Watercolor painting is very nice")).toBeOnTheScreen()
})

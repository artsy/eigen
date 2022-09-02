import { screen } from "@testing-library/react-native"
import { renderWithRelayWrappers } from "app/tests/renderWithWrappers"
import Biography from "./Biography"

it("renders without throwing a error", () => {
  const gene = {
    description: "Watercolor painting is very nice",
  }

  renderWithRelayWrappers(<Biography gene={gene as any} />)

  expect(screen.getByText("Watercolor painting is very nice")).toBeTruthy()
})

import { screen } from "@testing-library/react-native"
import Biography from "app/Components/Gene/Biography"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

it("renders without throwing a error", async () => {
  const gene = {
    description: "Watercolor painting is very nice",
  }
  await renderWithWrappers(<Biography gene={gene as any} />)

  expect(screen.getByText("Watercolor painting is very nice")).toBeOnTheScreen()
})

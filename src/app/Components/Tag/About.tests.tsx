import { screen } from "@testing-library/react-native"
import { renderWithRelayWrappers } from "app/tests/renderWithWrappers"
import { StickyTabPage } from "../StickyTabPage/StickyTabPage"
import About from "./About"

it("renders without throwing a error", () => {
  const tag = {
    description: `Handmade Paper is very nice`,
  }

  renderWithRelayWrappers(
    <StickyTabPage
      tabs={[
        {
          title: "Test Title",
          content: <About tag={tag as any} />,
        },
      ]}
    />
  )

  expect(screen.queryByText("Test Title")).toBeTruthy()
  expect(screen.queryByText("Handmade Paper is very nice")).toBeTruthy()
})

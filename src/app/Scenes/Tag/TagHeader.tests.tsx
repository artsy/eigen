import { screen } from "@testing-library/react-native"
import { renderWithRelayWrappers } from "app/tests/renderWithWrappers"

import Header from "./TagHeader"

it("renders without throwing a error", () => {
  const tag = {
    name: "Handmade Paper",
  }

  renderWithRelayWrappers(<Header tag={tag as any} />)

  expect(screen.getByText("Handmade Paper")).toBeTruthy()
})

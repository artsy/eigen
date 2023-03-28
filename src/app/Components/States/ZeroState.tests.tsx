import { screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { ZeroState } from "./ZeroState"

it("presents the title and subtitle", () => {
  const title = "A title for the zero state"
  const subtitle = "the subtitle for zero state"

  renderWithWrappers(<ZeroState title={title} subtitle={subtitle} />)

  expect(screen.queryByText(title)).toBeTruthy()
  expect(screen.queryByText(subtitle)).toBeTruthy()
})

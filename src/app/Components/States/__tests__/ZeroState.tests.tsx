import { screen } from "@testing-library/react-native"
import { ZeroState } from "app/Components/States/ZeroState"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

it("presents the title and subtitle", () => {
  const title = "A title for the zero state"
  const subtitle = "the subtitle for zero state"

  renderWithWrappers(<ZeroState title={title} subtitle={subtitle} />)

  expect(screen.queryByText(title)).toBeTruthy()
  expect(screen.queryByText(subtitle)).toBeTruthy()
})

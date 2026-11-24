import { screen } from "@testing-library/react-native"
import { ZeroState } from "app/Components/States/ZeroState"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

it("presents the title and subtitle", async () => {
  const title = "A title for the zero state"
  const subtitle = "the subtitle for zero state"

  await renderWithWrappers(<ZeroState title={title} subtitle={subtitle} />)

  expect(screen.getByText(title)).toBeTruthy()
  expect(screen.getByText(subtitle)).toBeTruthy()
})

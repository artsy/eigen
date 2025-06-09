import { screen } from "@testing-library/react-native"
import { Subtitle } from "app/Scenes/Inbox/Components/Typography"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

it("passes on props to subtitle", () => {
  renderWithWrappers(
    <Subtitle numberOfLines={1} ellipsizeMode="middle">
      My Subtitle
    </Subtitle>
  )
  expect(screen.getByText(/My Subtitle/)).toHaveProp("numberOfLines", 1)
  expect(screen.getByText(/My Subtitle/)).toHaveProp("ellipsizeMode", "middle")
})

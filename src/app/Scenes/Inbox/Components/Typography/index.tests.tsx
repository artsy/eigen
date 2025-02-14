import { screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Subtitle } from "./"

it("passes on props to subtitle", () => {
  renderWithWrappers(
    <Subtitle numberOfLines={1} ellipsizeMode="middle">
      My Subtitle
    </Subtitle>
  )
  expect(screen.getByText(/My Subtitle/)).toHaveProp("numberOfLines", 1)
  expect(screen.getByText(/My Subtitle/)).toHaveProp("ellipsizeMode", "middle")
})

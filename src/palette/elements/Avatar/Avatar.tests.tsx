import { screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Image } from "react-native"
import { Avatar, InitialsHolder } from ".."

describe("Avatar", () => {
  it("renders initials if no image url and initials provided", () => {
    renderWithWrappers(<Avatar initials="AB" />)

    expect(screen.UNSAFE_queryByType(Image)).not.toBeOnTheScreen()
    expect(screen.UNSAFE_queryByType(InitialsHolder)).toBeOnTheScreen()

    expect(screen.getByText("AB")).toBeOnTheScreen()
  })

  it("returns empty holder if no image url or initials", () => {
    renderWithWrappers(<Avatar />)

    expect(screen.UNSAFE_queryByType(Image)).not.toBeOnTheScreen()
    expect(screen.UNSAFE_queryByType(InitialsHolder)).toBeOnTheScreen()
  })
})

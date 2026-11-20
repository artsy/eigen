import { screen } from "@testing-library/react-native"
import { ColorsSwatch } from "app/Components/ArtworkFilter/Filters/ColorsSwatch"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("Colors swatch", () => {
  it("adds a check icon when selected", () => {
    renderWithWrappers(
      <ColorsSwatch
        width={30}
        backgroundColor="mono100"
        foregroundColor="#fff"
        name="blue"
        selected
      />
    )
    expect(screen.getByTestId("check-icon-blue")).toHaveProp("fill", "#fff")

    screen.unmount()

    renderWithWrappers(
      <ColorsSwatch
        width={30}
        backgroundColor="mono100"
        foregroundColor="#fff"
        name="blue"
        selected={false}
      />
    )
    expect(screen.queryByTestId("check-icon-blue")).not.toBeOnTheScreen()
  })

  it("has correct background color for passed in color", () => {
    renderWithWrappers(
      <ColorsSwatch
        width={30}
        backgroundColor="#435EA9"
        foregroundColor="#fff"
        name="blue"
        selected
      />
    )
    expect(screen.getByTestId("color-swatch-blue")).toHaveStyle({ backgroundColor: "#435EA9" })

    renderWithWrappers(
      <ColorsSwatch
        width={30}
        backgroundColor="#595A5B"
        foregroundColor="#fff"
        name="black-and-white"
        selected={false}
      />
    )
    expect(screen.getByTestId("color-swatch-black-and-white")).toHaveStyle({
      backgroundColor: "#595A5B",
    })

    renderWithWrappers(
      <ColorsSwatch
        width={30}
        backgroundColor="#F1572C"
        foregroundColor="#fff"
        name="orange"
        selected={false}
      />
    )
    expect(screen.getByTestId("color-swatch-orange")).toHaveStyle({ backgroundColor: "#F1572C" })
  })
})

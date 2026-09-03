import { screen } from "@testing-library/react-native"
import { BottomTabsIcon } from "app/Scenes/BottomTabs/BottomTabsIcon"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("BottomTabsIcon", () => {
  it("renders the artwork image when an override is provided for the favorites tab", () => {
    renderWithWrappers(
      <BottomTabsIcon
        tab="favorites"
        state="inactive"
        artworkImageOverride={{ url: "https://example.com/artwork.jpg" }}
      />
    )

    expect(screen.getByTestId("bottom-tabs-icon-artwork-image")).toBeOnTheScreen()
  })

  it("renders the standard heart icon when no override is provided", () => {
    renderWithWrappers(<BottomTabsIcon tab="favorites" state="inactive" />)

    expect(screen.queryByTestId("bottom-tabs-icon-artwork-image")).not.toBeOnTheScreen()
  })

  it("ignores an override for a tab other than favorites", () => {
    renderWithWrappers(
      <BottomTabsIcon
        tab="home"
        state="inactive"
        artworkImageOverride={{ url: "https://example.com/artwork.jpg" }}
      />
    )

    expect(screen.queryByTestId("bottom-tabs-icon-artwork-image")).not.toBeOnTheScreen()
  })
})

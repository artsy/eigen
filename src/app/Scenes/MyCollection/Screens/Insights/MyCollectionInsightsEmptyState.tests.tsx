import { fireEvent, screen } from "@testing-library/react-native"
import { Tab } from "app/Scenes/MyCollection/MyCollection"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { MyCollectionInsightsEmptyState } from "./MyCollectionInsightsEmptyState"

describe("MyCollectionInsightsEmptyState", () => {
  it("navigates to add work page when the user presses on add works", () => {
    renderWithWrappers(<MyCollectionInsightsEmptyState />)
    const uploadArtworkButton = screen.getAllByText("Add Artworks")[0]

    fireEvent(uploadArtworkButton, "press")
    expect(navigate).toHaveBeenCalledWith("my-collection/artworks/new", {
      passProps: {
        source: Tab.insights,
      },
    })
  })
})

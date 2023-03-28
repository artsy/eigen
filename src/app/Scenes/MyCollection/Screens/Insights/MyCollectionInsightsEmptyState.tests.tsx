import { fireEvent } from "@testing-library/react-native"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { navigate, popToRoot } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { MyCollectionInsightsEmptyState } from "./MyCollectionInsightsEmptyState"

describe("MyCollectionInsightsEmptyState", () => {
  it("navigates to add work page when the user presses on add works", () => {
    const { getAllByText } = renderWithWrappers(<MyCollectionInsightsEmptyState />)
    const uploadArtworkButton = getAllByText("Upload Artwork")[0]

    fireEvent(uploadArtworkButton, "press")
    expect(navigate).toHaveBeenCalledWith("my-collection/artworks/new", {
      passProps: {
        mode: "add",
        onSuccess: popToRoot,
        source: Tab.insights,
      },
    })
  })
})

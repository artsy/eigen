import { fireEvent } from "@testing-library/react-native"
import { navigate, popToRoot } from "app/navigation/navigate"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { MyCollectionInsightsEmptyState } from "./MyCollectionInsightsEmptyState"

describe("MyCollectionInsightsEmptyState", () => {
  it("navigates to add work page when the user presses on add works", () => {
    const { getAllByText } = renderWithWrappersTL(<MyCollectionInsightsEmptyState />)
    const uploadArtworkButton = getAllByText("Upload Your Artwork")[0]

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

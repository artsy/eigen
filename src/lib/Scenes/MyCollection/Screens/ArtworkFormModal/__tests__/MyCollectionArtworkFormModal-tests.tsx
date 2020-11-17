import { NavigationContainer } from "@react-navigation/native"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { MyCollectionArtworkFormMain } from "lib/Scenes/MyCollection/Screens/ArtworkFormModal/Screens/MyCollectionArtworkFormMain"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { MyCollectionArtworkFormModal } from "../MyCollectionArtworkFormModal"
import { MyCollectionAdditionalDetailsForm } from "../Screens/MyCollectionArtworkFormAdditionalDetails"
import { MyCollectionAddPhotos } from "../Screens/MyCollectionArtworkFormAddPhotos"

describe("MyCollectionArtworkFormModal", () => {
  it("creates a navigation stack containing expected components", () => {
    const wrapper = renderWithWrappers(
      <MyCollectionArtworkFormModal visible={true} mode="add" onSuccess={jest.fn()} onDismiss={jest.fn()} />
    )
    expect(wrapper.root.findAllByType(NavigationContainer)).toBeDefined()
    expect(wrapper.root.findAllByType(MyCollectionArtworkFormMain)).toBeDefined()
    expect(wrapper.root.findAllByType(MyCollectionAdditionalDetailsForm)).toBeDefined()
    expect(wrapper.root.findAllByType(MyCollectionAddPhotos)).toBeDefined()
  })

  it("calls dismiss on background click", () => {
    const mockDismiss = jest.fn()
    const wrapper = renderWithWrappers(
      <MyCollectionArtworkFormModal visible={true} mode="add" onSuccess={jest.fn()} onDismiss={mockDismiss} />
    )
    wrapper.root.findByType(FancyModal).props.onBackgroundPressed()
    expect(mockDismiss).toHaveBeenCalled()
  })

  // TODO: More tests for this component
})

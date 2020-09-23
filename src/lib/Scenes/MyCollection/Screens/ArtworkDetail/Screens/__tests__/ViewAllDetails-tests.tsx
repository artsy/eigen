import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { ViewAllDetails } from "lib/Scenes/MyCollection/Screens/ArtworkDetail/Screens/ViewAllDetails"
import { AppStore } from "lib/store/AppStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { MyCollectionArtworkMeta } from "../../Components/MyCollectionArtworkMeta"

jest.mock("../../Components/MyCollectionArtworkMeta", () => ({
  MyCollectionArtworkMeta: () => null,
}))

describe("ViewAllDetails", () => {
  it("renders without error", () => {
    const wrapper = renderWithWrappers(<ViewAllDetails />)
    expect(wrapper.root.findByType(FancyModalHeader)).toBeDefined()
    expect(wrapper.root.findByType(MyCollectionArtworkMeta)).toBeDefined()
  })

  it("calls goBack action on left header button click", () => {
    const spy = jest.fn()
    AppStore.actions.myCollection.navigation.goBack = spy as any
    const wrapper = renderWithWrappers(<ViewAllDetails />)
    wrapper.root.findByType(FancyModalHeader).props.onLeftButtonPress()
    expect(spy).toHaveBeenCalled()
  })

  it("calls startEditingArtwork action on right button press", () => {
    const artworkProps = { foo: "bar" }
    const spy = jest.fn()
    AppStore.actions.myCollection.artwork.startEditingArtwork = spy as any
    const wrapper = renderWithWrappers(<ViewAllDetails artwork={artworkProps} />)
    wrapper.root.findByType(FancyModalHeader).props.onRightButtonPress()
    expect(spy).toHaveBeenCalledWith(artworkProps)
  })
})

import { AppStore } from "lib/store/AppStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { TouchableOpacity } from "react-native"
import { MyCollectionArtworkListHeader } from "../MyCollectionArtworkListHeader"

describe("MyCollectionArtworkListHeader", () => {
  it("renders without error", () => {
    const wrapper = renderWithWrappers(<MyCollectionArtworkListHeader id="foo" />)
    expect(wrapper.root.findByType(TouchableOpacity)).toBeDefined()
    const text = extractText(wrapper.root)
    expect(text).toContain("Add artwork")
    expect(text).toContain("Artwork Insights")
  })

  it("calls proper actions on press", () => {
    const spy = jest.fn()
    const navSpy = jest.fn()
    AppStore.actions.myCollection.artwork.setMeGlobalId = spy as any
    AppStore.actions.myCollection.navigation.navigateToAddArtwork = navSpy as any
    const wrapper = renderWithWrappers(<MyCollectionArtworkListHeader id="foo" />)
    wrapper.root.findByType(TouchableOpacity).props.onPress()
    expect(spy).toHaveBeenCalledWith("foo")
    expect(navSpy).toHaveBeenCalled()
  })
})

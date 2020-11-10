import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { AppStore } from "lib/store/AppStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { MyCollectionArtworkInsightsFragmentContainer } from "../../Artwork/Components/ArtworkInsights/MyCollectionArtworkInsights"
import { MyCollectionArtworkHeaderFragmentContainer } from "../Components/MyCollectionArtworkHeader"
import { MyCollectionArtworkMetaFragmentContainer } from "../Components/MyCollectionArtworkMeta"
import { tests } from "../MyCollectionArtworkDetail"

jest.mock("../Components/MyCollectionArtworkHeader", () => ({
  MyCollectionArtworkHeaderFragmentContainer: () => null,
}))

jest.mock("../Components/MyCollectionArtworkMeta", () => ({
  MyCollectionArtworkMetaFragmentContainer: () => null,
}))

jest.mock("../Components/ArtworkInsights/MyCollectionArtworkInsights", () => ({
  MyCollectionArtworkInsightsFragmentContainer: () => null,
}))

describe("MyCollectionArtworkDetail", () => {
  const getWrapper = (props?: any) => {
    return renderWithWrappers(<tests.MyCollectionArtworkDetail {...props} />)
  }

  describe("artwork detail behavior", () => {
    it("renders correct components", () => {
      const wrapper = getWrapper()
      expect(wrapper.root.findByType(MyCollectionArtworkHeaderFragmentContainer)).toBeDefined()
      expect(wrapper.root.findByType(MyCollectionArtworkMetaFragmentContainer)).toBeDefined()
      expect(wrapper.root.findByType(MyCollectionArtworkInsightsFragmentContainer)).toBeDefined()
    })

    it("calls goBack function when header back button is pressed", () => {
      const spy = jest.fn()
      AppStore.actions.myCollection.navigation.goBack = spy as any
      const wrapper = getWrapper()
      wrapper.root.findByType(FancyModalHeader).props.onLeftButtonPress()
      expect(spy).toHaveBeenCalled()
    })

    it("calls startEditingArtworkAction when header edit button is pressed", () => {
      const artworkProps = { artwork: { internalID: "someInternalId" } }
      const spy = jest.fn()
      AppStore.actions.myCollection.artwork.startEditingArtwork = spy as any
      const wrapper = getWrapper(artworkProps)
      wrapper.root.findByType(FancyModalHeader).props.onRightButtonPress()
      expect(spy).toHaveBeenCalledWith(artworkProps.artwork)
    })

    it("calls navigateToConsignSubmission action when submit button is pressed", () => {
      const spy = jest.fn()
      AppStore.actions.myCollection.navigation.navigateToConsignSubmission = spy as any
      const wrapper = getWrapper()
      wrapper.root.findByProps({ "data-test-id": "SubmitButton" }).props.onPress()
      expect(spy).toHaveBeenCalled()
    })

    it("calls navigateToConsignLearnMore action when submit button is pressed", () => {
      const spy = jest.fn()
      AppStore.actions.myCollection.navigation.navigateToConsignLearnMore = spy as any
      const wrapper = getWrapper()
      wrapper.root.findByProps({ "data-test-id": "LearnMoreButton" }).props.onPress()
      expect(spy).toHaveBeenCalled()
    })
  })
})

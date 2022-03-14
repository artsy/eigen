import { editCollectedArtwork } from "@artsy/cohesion"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { GlobalStore } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { OldMyCollectionArtworkInsightsFragmentContainer } from "./Components/ArtworkInsights/OldMyCollectionArtworkInsights"
import { MyCollectionArtworkHeaderFragmentContainer } from "./Components/MyCollectionArtworkHeader"
import { MyCollectionArtworkMetaFragmentContainer } from "./Components/MyCollectionArtworkMeta"
import { tests } from "./OldMyCollectionArtwork"

jest.mock("./Components/MyCollectionArtworkHeader", () => ({
  MyCollectionArtworkHeaderFragmentContainer: () => null,
}))

jest.mock("./Components/MyCollectionArtworkMeta", () => ({
  MyCollectionArtworkMetaFragmentContainer: () => null,
}))

jest.mock("./Components/ArtworkInsights/OldMyCollectionArtworkInsights", () => ({
  OldMyCollectionArtworkInsightsFragmentContainer: () => null,
}))

describe("MyCollectionArtworkDetail", () => {
  const getWrapper = (props?: any) => {
    return renderWithWrappers(<tests.MyCollectionArtwork {...props} />)
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("artwork detail behavior", () => {
    it("renders correct components", () => {
      const artworkProps = { artwork: { internalID: "someInternalId" } }
      const wrapper = getWrapper(artworkProps)
      expect(wrapper.root.findByType(MyCollectionArtworkHeaderFragmentContainer)).toBeDefined()
      expect(wrapper.root.findByType(MyCollectionArtworkMetaFragmentContainer)).toBeDefined()
      expect(wrapper.root.findByType(OldMyCollectionArtworkInsightsFragmentContainer)).toBeDefined()
    })

    it("calls startEditingArtworkAction when header edit button is pressed", () => {
      const artworkProps = { artwork: { internalID: "someInternalId" } }
      const spy = jest.fn()
      GlobalStore.actions.myCollection.artwork.startEditingArtwork = spy as any
      const wrapper = getWrapper(artworkProps)
      wrapper.root.findByType(FancyModalHeader).props.onRightButtonPress()
      expect(spy).toHaveBeenCalledWith(artworkProps.artwork)
    })

    // Analytics

    it("tracks an analytics event when edit button is pressed", () => {
      const artworkProps = { artwork: { internalID: "someInternalId", slug: "someSlug" } }
      GlobalStore.actions.myCollection.artwork.startEditingArtwork = jest.fn() as any

      const wrapper = getWrapper(artworkProps)
      wrapper.root.findByType(FancyModalHeader).props.onRightButtonPress()

      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent).toHaveBeenCalledWith(
        editCollectedArtwork({ contextOwnerId: "someInternalId", contextOwnerSlug: "someSlug" })
      )
    })
  })
})

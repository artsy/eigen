import { ActionType, ContextModule, editCollectedArtwork, OwnerType, tappedSell } from "@artsy/cohesion"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { navigate } from "lib/navigation/navigate"
import { GlobalStore } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { postEventToProviders } from "lib/utils/track/providers"
import React from "react"
import { MyCollectionArtworkInsightsFragmentContainer } from "../Components/ArtworkInsights/MyCollectionArtworkInsights"
import { MyCollectionArtworkHeaderRefetchContainer } from "../Components/MyCollectionArtworkHeader"
import { MyCollectionArtworkMetaFragmentContainer } from "../Components/MyCollectionArtworkMeta"
import { tests } from "../MyCollectionArtwork"

jest.mock("../Components/MyCollectionArtworkHeader", () => ({
  MyCollectionArtworkHeaderRefetchContainer: () => null,
}))

jest.mock("../Components/MyCollectionArtworkMeta", () => ({
  MyCollectionArtworkMetaFragmentContainer: () => null,
}))

jest.mock("../Components/ArtworkInsights/MyCollectionArtworkInsights", () => ({
  MyCollectionArtworkInsightsFragmentContainer: () => null,
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
      expect(wrapper.root.findByType(MyCollectionArtworkHeaderRefetchContainer)).toBeDefined()
      expect(wrapper.root.findByType(MyCollectionArtworkMetaFragmentContainer)).toBeDefined()
      expect(wrapper.root.findByType(MyCollectionArtworkInsightsFragmentContainer)).toBeDefined()
    })

    it("calls startEditingArtworkAction when header edit button is pressed", () => {
      const artworkProps = { artwork: { internalID: "someInternalId" } }
      const spy = jest.fn()
      GlobalStore.actions.myCollection.artwork.startEditingArtwork = spy as any
      const wrapper = getWrapper(artworkProps)
      wrapper.root.findByType(FancyModalHeader).props.onRightButtonPress()
      expect(spy).toHaveBeenCalledWith(artworkProps.artwork)
    })

    it("navigates to consign submission when submit button is pressed", () => {
      const artworkProps = { artwork: { internalID: "someInternalId" } }
      const wrapper = getWrapper(artworkProps)
      wrapper.root.findByProps({ "data-test-id": "SubmitButton" }).props.onPress()
      expect(navigate).toHaveBeenCalledWith("/consign/submission")
    })

    it("navigates to sales page when learn more button is pressed", () => {
      const artworkProps = { artwork: { internalID: "someInternalId" } }
      const wrapper = getWrapper(artworkProps)
      wrapper.root.findByProps({ "data-test-id": "LearnMoreButton" }).props.onPress()
      expect(navigate).toHaveBeenCalledWith("/sales")
    })

    // Analytics

    it("tracks an analytics event when edit button is pressed", () => {
      const artworkProps = { artwork: { internalID: "someInternalId", slug: "someSlug" } }
      GlobalStore.actions.myCollection.artwork.startEditingArtwork = jest.fn() as any

      const wrapper = getWrapper(artworkProps)
      wrapper.root.findByType(FancyModalHeader).props.onRightButtonPress()

      expect(postEventToProviders).toHaveBeenCalledTimes(1)
      expect(postEventToProviders).toHaveBeenCalledWith(
        editCollectedArtwork({ contextOwnerId: "someInternalId", contextOwnerSlug: "someSlug" })
      )
    })

    it("tracks an analytics event submit button is pressed", () => {
      const artworkProps = { artwork: { internalID: "someInternalId", slug: "someSlug" } }
      GlobalStore.actions.myCollection.artwork.startEditingArtwork = jest.fn() as any

      const wrapper = getWrapper(artworkProps)
      wrapper.root.findByProps({ "data-test-id": "SubmitButton" }).props.onPress()

      expect(postEventToProviders).toHaveBeenCalledTimes(1)
      expect(postEventToProviders).toHaveBeenCalledWith(
        tappedSell({
          contextModule: ContextModule.sellFooter,
          contextScreenOwnerType: OwnerType.myCollectionArtwork,
          contextScreenOwnerId: "someInternalId",
          contextScreenOwnerSlug: "someSlug",
          subject: "Submit this work",
        })
      )
    })

    it("tracks an analytics event learn more button is pressed", () => {
      const artworkProps = { artwork: { internalID: "someInternalId", slug: "someSlug" } }
      GlobalStore.actions.myCollection.artwork.startEditingArtwork = jest.fn() as any

      const wrapper = getWrapper(artworkProps)
      wrapper.root.findByProps({ "data-test-id": "LearnMoreButton" }).props.onPress()

      expect(postEventToProviders).toHaveBeenCalledTimes(1)
      expect(postEventToProviders).toHaveBeenCalledWith({
        action: ActionType.tappedShowMore,
        context_module: ContextModule.sellFooter,
        context_screen_owner_type: OwnerType.myCollectionArtwork,
        context_screen_owner_id: "someInternalId",
        context_screen_owner_slug: "someSlug",
        subject: "Learn More",
      })
    })
  })
})

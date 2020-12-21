import { editCollectedArtwork } from "@artsy/cohesion"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { navigate } from "lib/navigation/navigate"
import { GlobalStore } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { useTracking } from "react-tracking"
import { MyCollectionArtworkInsightsFragmentContainer } from "../Components/ArtworkInsights/MyCollectionArtworkInsights"
import { MyCollectionArtworkHeaderFragmentContainer } from "../Components/MyCollectionArtworkHeader"
import { MyCollectionArtworkMetaFragmentContainer } from "../Components/MyCollectionArtworkMeta"
import { tests } from "../MyCollectionArtwork"

jest.mock("../Components/MyCollectionArtworkHeader", () => ({
  MyCollectionArtworkHeaderFragmentContainer: () => null,
}))

jest.mock("../Components/MyCollectionArtworkMeta", () => ({
  MyCollectionArtworkMetaFragmentContainer: () => null,
}))

jest.mock("../Components/ArtworkInsights/MyCollectionArtworkInsights", () => ({
  MyCollectionArtworkInsightsFragmentContainer: () => null,
}))

jest.mock("react-tracking")

describe("MyCollectionArtworkDetail", () => {
  const trackEvent = jest.fn()

  const getWrapper = (props?: any) => {
    return renderWithWrappers(<tests.MyCollectionArtwork {...props} />)
  }

  beforeEach(() => {
    const mockTracking = useTracking as jest.Mock
    mockTracking.mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("artwork detail behavior", () => {
    it("renders correct components", () => {
      const wrapper = getWrapper()
      expect(wrapper.root.findByType(MyCollectionArtworkHeaderFragmentContainer)).toBeDefined()
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

    it("tracks an analytics event when edit button is pressed", () => {
      const artworkProps = { artwork: { internalID: "someInternalId", slug: "someSlug" } }
      GlobalStore.actions.myCollection.artwork.startEditingArtwork = jest.fn() as any

      const wrapper = getWrapper(artworkProps)
      wrapper.root.findByType(FancyModalHeader).props.onRightButtonPress()

      expect(trackEvent).toHaveBeenCalledTimes(1)
      expect(trackEvent).toHaveBeenCalledWith(
        editCollectedArtwork({ contextOwnerId: "someInternalId", contextOwnerSlug: "someSlug" })
      )
    })

    it("navigates to consign submission when submit button is pressed", () => {
      const wrapper = getWrapper()
      wrapper.root.findByProps({ "data-test-id": "SubmitButton" }).props.onPress()
      expect(navigate).toHaveBeenCalledWith("/consign/submission")
    })

    it("navigates to sales page when learn more button is pressed", () => {
      const wrapper = getWrapper()
      wrapper.root.findByProps({ "data-test-id": "LearnMoreButton" }).props.onPress()
      expect(navigate).toHaveBeenCalledWith("/sales")
    })
  })
})

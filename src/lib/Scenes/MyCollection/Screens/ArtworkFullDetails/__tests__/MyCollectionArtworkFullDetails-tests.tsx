import { editCollectedArtwork } from "@artsy/cohesion"
import { MyCollectionArtworkFullDetailsTestsQuery } from "__generated__/MyCollectionArtworkFullDetailsTestsQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { GlobalStore } from "lib/store/GlobalStore"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { createMockEnvironment } from "relay-test-utils"
import { MyCollectionArtworkFullDetailsContainer } from "../MyCollectionArtworkFullDetails"

jest.unmock("react-relay")
jest.mock("react-tracking")

describe("MyCollectionArtworkFullDetails", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyCollectionArtworkFullDetailsTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionArtworkFullDetailsTestsQuery @relay_test_operation {
          artwork(id: "some-slug") {
            ...MyCollectionArtworkFullDetails_artwork
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork) {
          return <MyCollectionArtworkFullDetailsContainer artwork={props.artwork} />
        }
        return null
      }}
    />
  )

  const trackEvent = jest.fn()

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironmentPayload(mockEnvironment, mockResolvers)
    return tree
  }

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
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

  describe("edit button pressed", () => {
    it("tracks an analytics event", () => {
      const wrapper = getWrapper({
        Artwork: () => ({
          internalID: "someInternalId",
          slug: "someSlug",
        }),
      })
      GlobalStore.actions.myCollection.artwork.startEditingArtwork = jest.fn() as any

      wrapper.root.findByType(FancyModalHeader).props.onRightButtonPress()

      expect(trackEvent).toHaveBeenCalledTimes(1)
      expect(trackEvent).toHaveBeenCalledWith(
        editCollectedArtwork({ contextOwnerId: "someInternalId", contextOwnerSlug: "someSlug" })
      )
    })
  })
})

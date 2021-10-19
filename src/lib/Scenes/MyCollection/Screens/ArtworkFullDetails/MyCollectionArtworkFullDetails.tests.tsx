import { editCollectedArtwork } from "@artsy/cohesion"
import { MyCollectionArtworkFullDetailsTestsQuery } from "__generated__/MyCollectionArtworkFullDetailsTestsQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { GlobalStore } from "lib/store/GlobalStore"
import { mockTrackEvent } from "lib/tests/globallyMockedStuff"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { MyCollectionArtworkFullDetailsContainer } from "./MyCollectionArtworkFullDetails"

jest.unmock("react-relay")

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

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironmentPayload(mockEnvironment, mockResolvers)
    return tree
  }

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
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

      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent).toHaveBeenCalledWith(
        editCollectedArtwork({ contextOwnerId: "someInternalId", contextOwnerSlug: "someSlug" })
      )
    })
  })
})

import React from "react"
import "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

import { ArtistListTestsQuery } from "__generated__/ArtistListTestsQuery.graphql"
import { extractText } from "app/tests/extractText"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { ArtistListFragmentContainer } from "./ArtistList"

jest.unmock("react-relay")

describe("ArtistList", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<ArtistListTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query ArtistListTestsQuery {
          targetSupply {
            ...ArtistList_targetSupply
          }
        }
      `}
      render={renderWithLoadProgress(ArtistListFragmentContainer)}
      variables={{}}
    />
  )

  it("renders an item for each artist", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    const targetSupply = makeTargetSupply([
      { name: "artist #1" },
      { name: "artist #2" },
      { name: "artist #3" },
      { name: "artist #4" },
      { name: "artist #5" },
    ])
    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
        TargetSupply: () => targetSupply,
      })
      return result
    })

    const text = extractText(tree.root)
    expect(text).toContain("artist #1")
    expect(text).toContain("artist #2")
    expect(text).toContain("artist #3")
    expect(text).toContain("artist #4")
    expect(text).toContain("artist #5")
  })

  it("tracks an event for tapping an artist", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    const artist = {
      internalID: "artist-id",
      slug: "artist-slug",
    }
    const targetSupply = makeTargetSupply([artist])
    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
        TargetSupply: () => targetSupply,
      })
      return result
    })

    tree.root.findByProps({ testID: "artist-item" }).props.onPress()
    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        context_module: "artistHighDemandGrid",
        context_screen_owner_type: "sell",
        destination_screen_owner_id: "artist-id",
        destination_screen_owner_slug: "artist-slug",
        destination_screen_owner_type: "artist",
        type: "thumbnail",
      })
    )
  })
})

function makeTargetSupply(artists: Array<{ name?: string; internalID?: string; slug?: string }>) {
  return {
    microfunnel: artists.map((artist) => {
      return {
        artist,
      }
    }),
  }
}

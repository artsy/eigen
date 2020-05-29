import { Theme } from "@artsy/palette"
import React from "react"
import "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { create } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

import { ArtistListTestsQuery } from "__generated__/ArtistListTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { ArtistListFragmentContainer } from "../ArtistList"

jest.unmock("react-relay")
jest.mock("react-tracking")

describe("ArtistList", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const trackEvent = jest.fn()

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    ;(useTracking as jest.Mock).mockReturnValue({
      trackEvent,
    })
  })

  afterEach(() => {
    trackEvent.mockClear()
  })

  const TestRenderer = () => (
    <Theme>
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
    </Theme>
  )

  it("renders an item for each artist", () => {
    const tree = create(<TestRenderer />)

    const targetSupply = makeTargetSupply([
      { name: "artist #1" },
      { name: "artist #2" },
      { name: "artist #3" },
      { name: "artist #4" },
      { name: "artist #5" },
    ])
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
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
    const tree = create(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation(MockPayloadGenerator.generate)

    tree.root.findByProps({ "data-test-id": "artist-item" }).props.onPress()
    expect(trackEvent).toHaveBeenCalledTimes(1)
    expect(trackEvent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        context_module: "artistHighDemandGrid",
        context_screen_owner_type: "sell",
        destination_screen_owner_type: "artist",
        type: "thumbnail",
      })
    )
  })
})

function makeTargetSupply(artists: Array<{ name: string }>) {
  return {
    microfunnel: artists.map(artist => {
      return {
        artist,
      }
    }),
  }
}

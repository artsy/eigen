import { ArtistHeaderTestsQuery } from "__generated__/ArtistHeaderTestsQuery.graphql"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

import { ArtistHeaderFragmentContainer } from "app/Components/Artist/ArtistHeader"
import { extractText } from "app/tests/extractText"
import { mockEnvironmentPayload } from "app/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Button, Sans } from "palette"

jest.unmock("react-relay")

describe("ArtistHeader", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  function TestRenderer() {
    return (
      <QueryRenderer<ArtistHeaderTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query ArtistHeaderTestsQuery($artistID: String!) @relay_test_operation {
            artist(id: $artistID) {
              ...ArtistHeader_artist
            }
          }
        `}
        variables={{ artistID: "artist-id" }}
        render={({ props }) => {
          if (props?.artist) {
            return <ArtistHeaderFragmentContainer artist={props.artist} />
          }
          return null
        }}
      />
    )
  }

  it("renders properly", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Artist: () => mockArtist,
    })

    expect(tree.root.findAllByType(Sans)[0].props.children).toMatch("Marcel Duchamp")
  })

  it("displays follow button for artist", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Artist: () => mockArtist,
    })

    expect(tree.root.findAllByType(Button)[0].props.children).toMatch("Follow")
  })

  it("does not show followers count when it is < 2", () => {
    mockArtist.counts.follows = 1

    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Artist: () => mockArtist,
    })

    const text = extractText(tree.root)

    expect(text.includes("1 followers")).toBeFalse()
  })
})

const mockArtist = {
  internalID: "some-id",
  id: "marcel-duchamp",
  name: "Marcel Duchamp",
  nationality: "French",
  birthday: "11/17/1992",
  counts: {
    follows: 22,
  },
}

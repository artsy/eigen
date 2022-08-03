import { ArtistHeaderTestsQuery } from "__generated__/ArtistHeaderTestsQuery.graphql"
import { graphql, QueryRenderer } from "react-relay"

import { ArtistHeaderFragmentContainer } from "app/Components/Artist/ArtistHeader"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { Button, Text } from "palette"

describe("ArtistHeader", () => {
  function TestRenderer() {
    return (
      <QueryRenderer<ArtistHeaderTestsQuery>
        environment={getRelayEnvironment()}
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
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

    resolveMostRecentRelayOperation({
      Artist: () => mockArtist,
    })

    expect(tree.root.findAllByType(Text)[0].props.children).toMatch("Marcel Duchamp")
  })

  it("displays follow button for artist", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

    resolveMostRecentRelayOperation({
      Artist: () => mockArtist,
    })

    expect(tree.root.findAllByType(Button)[0].props.children).toMatch("Follow")
  })

  it("does not show followers count when it is < 2", () => {
    mockArtist.counts.follows = 1

    const tree = renderWithWrappersLEGACY(<TestRenderer />)

    resolveMostRecentRelayOperation({
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

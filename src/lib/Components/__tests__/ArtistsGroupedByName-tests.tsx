import { Theme } from "@artsy/palette"
import { ArtistFixture } from "lib/__fixtures__/ArtistFixture"
import { ArtistListItem } from "lib/Components/ArtistListItem"
import { ArtistsGroupedByName } from "lib/Components/ArtistsGroupedByName"
import { FairArtists } from "lib/Scenes/Fair/Screens/FairArtists"
import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import { renderUntil } from "lib/tests/renderUntil"
import { times } from "lodash"
import React from "react"
import { graphql } from "react-relay"

jest.unmock("react-relay")

describe("ArtistsGroupedByName", () => {
  it("renders properly", async () => {
    const tree = await renderUntil(
      wrapper => {
        return wrapper.find(ArtistListItem).length > 0
      },
      <MockRelayRenderer
        Component={({ artist }) => {
          const data = times(5, idx => ({
            letter: "ABCD".charAt(idx),
            data: [artist],
            index: idx,
          }))
          return (
            <Theme>
              <ArtistsGroupedByName data={data} Component={FairArtists} />
            </Theme>
          )
        }}
        query={graphql`
          query ArtistsGroupedByNameTestsQuery {
            artist(id: "pablo-picasso") {
              ...ArtistListItem_artist
            }
          }
        `}
        mockData={{
          artist: ArtistFixture,
        }}
      />
    )
    expect(tree.html()).toMatchSnapshot()
  })
})

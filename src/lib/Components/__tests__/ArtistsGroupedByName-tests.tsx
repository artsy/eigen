import { ArtistFixture } from "lib/__fixtures__/ArtistFixture"
import { ArtistsGroupedByName } from "lib/Components/ArtistsGroupedByName"
import { FairArtists } from "lib/Scenes/Fair/Screens/FairArtists"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import { times } from "lodash"
import { Theme } from "palette"
import React from "react"
import { graphql } from "react-relay"

jest.unmock("react-relay")

describe("ArtistsGroupedByName", () => {
  it("renders without throwing an error", async () => {
    await renderRelayTree({
      Component: ({ artist }) => {
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
      },
      query: graphql`
        query ArtistsGroupedByNameTestsQuery @raw_response_type {
          artist(id: "pablo-picasso") {
            ...ArtistListItem_artist
          }
        }
      `,
      mockData: {
        artist: ArtistFixture,
      }, // Enable/fix this when making large change to these components/fixtures: as ArtistsGroupedByNameTestsQueryRawResponse,
    })
  })
})

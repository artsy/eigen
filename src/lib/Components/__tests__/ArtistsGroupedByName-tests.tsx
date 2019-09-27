import { Theme } from "@artsy/palette"
import { ArtistsGroupedByNameTestsQueryRawResponse } from "__generated__/ArtistsGroupedByNameTestsQuery.graphql"
import { ArtistFixture } from "lib/__fixtures__/ArtistFixture"
import { ArtistsGroupedByName } from "lib/Components/ArtistsGroupedByName"
import { FairArtists } from "lib/Scenes/Fair/Screens/FairArtists"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import { times } from "lodash"
import React from "react"
import { graphql } from "react-relay"

jest.unmock("react-relay")

describe("ArtistsGroupedByName", () => {
  it("renders properly", async () => {
    const tree = await renderRelayTree({
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
      } as ArtistsGroupedByNameTestsQueryRawResponse,
    })
    expect(tree.html()).toMatchSnapshot()
  })
})

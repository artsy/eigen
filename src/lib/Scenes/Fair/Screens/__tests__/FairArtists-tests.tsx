import { ArtistListItem } from "lib/Components/ArtistListItem"
import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import { renderUntil } from "lib/tests/renderUntil"
import React from "react"
import { graphql } from "react-relay"
import { fairFixture } from "../../__fixtures__"
import { FairArtistsContainer as FairArtistsScreen } from "../FairArtists"

jest.unmock("react-relay")

describe("FairArtists", () => {
  it("renders properly", async () => {
    const tree = await renderUntil(
      wrapper => {
        return wrapper.find(ArtistListItem).length > 0
      },
      <MockRelayRenderer
        Component={FairArtistsScreen}
        query={graphql`
          query FairArtistsTestsQuery {
            fair(id: "sofa-chicago-2018") {
              ...FairArtists_fair
            }
          }
        `}
        mockResolvers={{
          Fair: () => fairFixture,
        }}
      />
    )

    expect(tree.html()).toMatchSnapshot()
  })
})

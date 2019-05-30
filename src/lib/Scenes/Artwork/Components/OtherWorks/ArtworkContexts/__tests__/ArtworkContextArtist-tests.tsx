import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import { renderUntil } from "lib/tests/renderUntil"
import React from "react"
import { graphql } from "react-relay"
import { Header } from "../../Header"
import { ArtworkContextArtistFragmentContainer as ArtworkContextArtist } from "../ArtworkContextArtist"

jest.unmock("react-relay")

describe("AllArtists", () => {
  it("renders properly", async () => {
    const tree = await renderUntil(
      wrapper => {
        return wrapper.find(Header).length > 0
      },
      <MockRelayRenderer
        Component={ArtworkContextArtist}
        query={graphql`
          query ArtworkContextArtistTestsQuery($excludeArtworkIds: [String]) {
            artwork(id: "abbas-kiarostami-untitled-7") {
              ...ArtworkContextArtist_artwork
            }
          }
        `}
        mockResolvers={{
          Artwork: () => ArtworkFixture,
        }}
      />
    )

    expect(tree.html()).toMatchSnapshot()
  })
})

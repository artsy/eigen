import { ShowFixture } from "lib/__fixtures__/ShowFixture"
import { ArtistsGroupedByName } from "lib/Components/ArtistsGroupedByName"
import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import { renderUntil } from "lib/tests/renderUntil"
import React from "react"
import { graphql } from "react-relay"
import { ShowArtistsContainer as ShowArtistsScreen } from "../../../../Scenes/Show/Screens/ShowArtists"

jest.unmock("react-relay")

describe("AllArtists", () => {
  it("renders properly", async () => {
    const tree = await renderUntil(
      wrapper => {
        return wrapper.find(ArtistsGroupedByName).length > 0
      },
      <MockRelayRenderer
        Component={ShowArtistsScreen}
        query={graphql`
          query ShowArtistsTestsQuery {
            show(id: "anderson-fine-art-gallery-flickinger-collection") {
              ...ShowArtists_show
            }
          }
        `}
        mockResolvers={{
          Show: () => ShowFixture,
        }}
      />
    )

    expect(tree.html()).toMatchSnapshot()
  })
})

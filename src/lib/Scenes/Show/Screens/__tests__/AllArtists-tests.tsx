import { ShowFixture } from "lib/__fixtures__/ShowFixture"
import { ArtistsGroupedByName } from "lib/Components/ArtistsGroupedByName"
import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import { renderUntil } from "lib/tests/renderUntil"
import React from "react"
import { graphql } from "react-relay"
import { AllArtistsContainer as AllArtistsScreen } from "../AllArtists"

jest.unmock("react-relay")

describe("AllArtists", () => {
  it("renders properly", async () => {
    const tree = await renderUntil(
      wrapper => {
        return wrapper.find(ArtistsGroupedByName).length > 0
      },
      <MockRelayRenderer
        Component={AllArtistsScreen}
        query={graphql`
          query AllArtistsTestsQuery {
            show(id: "anderson-fine-art-gallery-flickinger-collection") {
              ...AllArtists_show
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

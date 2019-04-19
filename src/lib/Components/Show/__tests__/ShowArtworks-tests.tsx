import { ShowFixture } from "lib/__fixtures__/ShowFixture"
import { FilteredInfiniteScrollGrid } from "lib/Components/FilteredInfiniteScrollGrid"
import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import { renderUntil } from "lib/tests/renderUntil"
import React from "react"
import { graphql } from "react-relay"
import { ShowArtworksContainer as ShowArtworks } from "../../../Scenes/Show/Screens/ShowArtworks"

jest.unmock("react-relay")

it("renders properly", async () => {
  const tree = await renderUntil(
    wrapper => {
      return wrapper.find(FilteredInfiniteScrollGrid).length > 0
    },
    <MockRelayRenderer
      Component={ShowArtworks}
      query={graphql`
        query ShowArtworksTestsQuery {
          show(id: "anderson-fine-art-gallery-flickinger-collection") {
            ...ShowArtworks_show
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

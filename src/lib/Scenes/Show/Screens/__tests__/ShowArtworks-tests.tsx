import { ShowFixture } from "lib/__fixtures__/ShowFixture"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import { graphql } from "react-relay"
import { ShowArtworksContainer as ShowArtworks } from "../../../../Scenes/Show/Screens/ShowArtworks"

jest.unmock("react-relay")

xit("renders properly", async () => {
  const tree = await renderRelayTree({
    Component: ShowArtworks,
    query: graphql`
      query ShowArtworksTestsQuery {
        show(id: "anderson-fine-art-gallery-flickinger-collection") {
          ...ShowArtworks_show
        }
      }
    `,
    mockResolvers: {
      Show: () => ShowFixture,
    },
  })

  expect(tree.html()).toMatchSnapshot()
})

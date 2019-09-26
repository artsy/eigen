import { ShowFixture } from "lib/__fixtures__/ShowFixture"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import { graphql } from "react-relay"
import { ShowArtistsContainer as ShowArtistsScreen } from "../../../../Scenes/Show/Screens/ShowArtists"

jest.unmock("react-relay")

// FIXME: Fix fixture data
describe("AllArtists", () => {
  xit("renders properly", async () => {
    const tree = await renderRelayTree({
      Component: ShowArtistsScreen,
      query: graphql`
        query ShowArtistsTestsQuery {
          show(id: "anderson-fine-art-gallery-flickinger-collection") {
            ...ShowArtists_show
          }
        }
      `,
      mockData: {
        show: ShowFixture,
      },
    })

    expect(tree.html()).toMatchSnapshot()
  })
})

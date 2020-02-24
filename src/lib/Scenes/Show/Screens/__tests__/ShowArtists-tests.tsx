import { ShowArtistsTestsQueryRawResponse } from "__generated__/ShowArtistsTestsQuery.graphql"
import { ShowFixture } from "lib/__fixtures__/ShowFixture"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import { graphql } from "react-relay"
import { ShowArtistsContainer as ShowArtistsScreen } from "../../../../Scenes/Show/Screens/ShowArtists"

jest.unmock("react-relay")

describe("AllArtists", () => {
  it("renders properly", async () => {
    const tree = await renderRelayTree({
      Component: ShowArtistsScreen,
      query: graphql`
        query ShowArtistsTestsQuery @raw_response_type {
          show(id: "anderson-fine-art-gallery-flickinger-collection") {
            ...ShowArtists_show
          }
        }
      `,
      mockData: {
        show: ShowFixture,
      } as ShowArtistsTestsQueryRawResponse,
    })

    expect(tree.html()).toMatchSnapshot()
  })
})

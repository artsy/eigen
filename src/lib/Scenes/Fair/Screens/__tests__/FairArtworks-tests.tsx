import { renderRelayTree } from "lib/tests/renderRelayTree"
import { graphql } from "react-relay"
import { fairFixture } from "../../__fixtures__"
import { FairArtworksContainer as FairArtworks } from "../FairArtworks"

jest.unmock("react-relay")

xit("renders properly", async () => {
  const tree = await renderRelayTree({
    Component: FairArtworks,
    query: graphql`
      query FairArtworksTestsQuery {
        fair(id: "sofa-chicago-2018") {
          ...FairArtworks_fair
        }
      }
    `,
    mockResolvers: {
      Fair: () => fairFixture,
    },
  })

  expect(tree.html()).toMatchSnapshot()
})

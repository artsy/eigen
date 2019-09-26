import { renderRelayTree } from "lib/tests/renderRelayTree"
import { graphql } from "react-relay"
import { fairFixture } from "../../__fixtures__"
import { ArtworksPreviewContainer as ArtworksPreview } from "../ArtworksPreview"

jest.unmock("react-relay")

it("renders properly", async () => {
  const tree = await renderRelayTree({
    Component: ArtworksPreview,
    query: graphql`
      query ArtworksPreviewTestsQuery {
        fair(id: "sofa-chicago-2018") {
          ...ArtworksPreview_fair
        }
      }
    `,
    mockResolvers: {
      Fair: () => fairFixture,
    },
  })

  expect(tree.html()).toMatchSnapshot()
})

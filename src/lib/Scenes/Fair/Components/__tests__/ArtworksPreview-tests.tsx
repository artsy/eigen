import { ArtworksPreviewTestsQueryRawResponse } from "__generated__/ArtworksPreviewTestsQuery.graphql"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import { graphql } from "react-relay"
import { fairFixture } from "../../__fixtures__"
import { ArtworksPreviewContainer as ArtworksPreview } from "../ArtworksPreview"

jest.unmock("react-relay")

it("renders properly", async () => {
  const tree = await renderRelayTree({
    Component: ArtworksPreview,
    query: graphql`
      query ArtworksPreviewTestsQuery @raw_response_type {
        fair(id: "sofa-chicago-2018") {
          ...ArtworksPreview_fair
        }
      }
    `,
    mockResolvers: {
      Fair: () => fairFixture,
    } as ArtworksPreviewTestsQueryRawResponse,
  })

  expect(tree.html()).toMatchSnapshot()
})

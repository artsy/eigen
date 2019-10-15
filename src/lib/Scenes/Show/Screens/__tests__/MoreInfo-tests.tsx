import { MoreInfoTestsQueryRawResponse } from "__generated__/MoreInfoTestsQuery.graphql"
import { graphql } from "react-relay"

import { ShowFixture } from "lib/__fixtures__/ShowFixture"

import { renderRelayTree } from "lib/tests/renderRelayTree"
import { MoreInfoContainer } from "../MoreInfo"

jest.unmock("react-relay")

it("Renders the Show MoreInfo screen", async () => {
  const tree = await renderRelayTree({
    Component: MoreInfoContainer,
    query: graphql`
      query MoreInfoTestsQuery @raw_response_type {
        show(id: "anderson-fine-art-gallery-flickinger-collection") {
          ...MoreInfo_show
        }
      }
    `,
    mockData: {
      show: ShowFixture,
    } as MoreInfoTestsQueryRawResponse,
  })

  expect(tree.text()).toContain("Paintings and Sculpture from the Sea Island Estate of the Flickingers")
})

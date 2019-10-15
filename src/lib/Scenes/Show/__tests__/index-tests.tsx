import { indexTestsQueryRawResponse } from "__generated__/indexTestsQuery.graphql"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import { graphql } from "react-relay"
import Show from "../"
import { ShowFixture } from "./fixtures"

jest.unmock("react-relay")

it("Renders a show", async () => {
  const tree = await renderRelayTree({
    Component: Show,
    query: graphql`
      query indexTestsQuery @raw_response_type {
        show(id: "art-gallery-pure-art-of-design-at-art-gallery-pure") {
          ...Show_show
        }
      }
    `,
    mockData: {
      show: ShowFixture,
    } as indexTestsQueryRawResponse,
  })

  expect(tree.text()).toContain("ART of DESIGN at Art Gallery Pure")
})

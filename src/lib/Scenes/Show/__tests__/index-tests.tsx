import { renderRelayTree } from "lib/tests/renderRelayTree"
import { graphql } from "react-relay"
import Show from "../"
import { ShowFixture } from "./fixtures"

jest.unmock("react-relay")

it("Renders a show", async () => {
  const tree = await renderRelayTree({
    Component: Show,
    query: graphql`
      query indexTestsQuery {
        show(id: "anderson-fine-art-gallery-flickinger-collection") {
          ...Show_show
        }
      }
    `,
    mockResolvers: {
      Show: () => ShowFixture,
    },
  })

  expect(tree.text()).toContain("Flickinger Collection")
})

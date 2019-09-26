import { renderRelayTree } from "lib/tests/renderRelayTree"
import { graphql } from "react-relay"
import { ShowFixture } from "../../../__fixtures__/ShowFixture"
import { ShowContainer } from "../Show"

jest.unmock("react-relay")

const renderTree = () =>
  renderRelayTree({
    Component: ShowContainer,
    query: graphql`
      query ShowTestsQuery {
        show(id: "anderson-fine-art-gallery-flickinger-collection") {
          ...Show_show
        }
      }
    `,
    mockResolvers: {
      Show: () => ({
        ...ShowFixture,
        artists: () => ShowFixture.artists,
      }),
    },
  })

xit("renders the Show screen", async () => {
  const tree = await renderTree()
  expect(tree.text()).toContain("Flickinger Collection")
})

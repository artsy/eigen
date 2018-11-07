import { renderRelayTree } from "lib/tests/renderRelayTree"
import { graphql } from "react-relay"
import Fair from "../"
import { FairFixture } from "../__fixtures__"

jest.unmock("react-relay")

it("renders properly", async () => {
  const tree = await renderRelayTree({
    Component: Fair,
    query: graphql`
      query indexTestsQuery {
        fair(id: "sofa-chicago-2018") {
          ...FairHeader_fair
        }
      }
    `,
    mockResolvers: {
      Fair: () => FairFixture,
    },
  })

  expect(tree).toMatchSnapshot()
})

import { renderRelayTree } from "lib/tests/renderRelayTree"
import { graphql } from "react-relay"
import { fairFixture } from "../../__fixtures__"
import { FairDetailContainer as FairDetail } from "../FairDetail"

jest.unmock("react-relay")

// FIXME: Fix fixture data
describe("FairDetail", () => {
  xit("renders properly", async () => {
    const tree = await renderRelayTree({
      Component: FairDetail,
      query: graphql`
        query FairDetailTestsQuery @raw_response_type {
          fair(id: "sofa-chicago-2018") {
            ...FairDetail_fair
          }
        }
      `,
      mockData: {
        fair: fairFixture,
      }, // Enable/fix this when making large change to these components/fixtures: as FairDetailTestsQueryRawResponse,
    })

    expect(tree.html()).toMatchSnapshot()
  })
})

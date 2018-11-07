import { renderRelayTree } from "lib/tests/renderRelayTree"
import { graphql } from "react-relay"
import { FairFixture } from "../../../__fixtures__"
import { FairHeaderContainer as FairHeader } from "../index"

jest.unmock("react-relay")

describe("FairHeader", () => {
  it("renders properly", async () => {
    const tree = await renderRelayTree({
      Component: FairHeader,
      query: graphql`
        query FairHeaderTestsQuery {
          fair(id: "sofa-chicago-2018") {
            ...FairHeader_fair
          }
        }
      `,
      mockResolvers: {
        Fair: () => FairFixture,
      },
    })

    expect(tree.html()).toMatchSnapshot()
  })
})

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

    const result = `<aropaqueimageview imageurl="https://d32dm0rphc51dk.cloudfront.net/o0Zrtm-CgwbV1syD_33DuA/square.jpg" aspectratio="1" width="750"><view></view><image source="[object Object]"></image></aropaqueimageview>`
    expect(tree.html()).toEqual(result)
  })
})

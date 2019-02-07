import { Theme } from "@artsy/palette"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql } from "react-relay"
import { FairFixture } from "../../../__fixtures__"
import { FairBoothPreviewContainer } from "../index"

jest.unmock("react-relay")

describe("FairHeader", () => {
  it("renders properly", async () => {
    const tree = await renderRelayTree({
      Component: (props: any) => (
        <Theme>
          <FairBoothPreviewContainer {...props} />
        </Theme>
      ),
      query: graphql`
        query FairHeaderTestsQuery {
          show(id: "abxy-blk-and-blue") {
            ...FairBoothPreview_show
          }
        }
      `,
      mockData: {
        fair: FairFixture,
      },
    })

    expect(tree.html()).toMatchSnapshot()
  })
})

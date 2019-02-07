import { Theme } from "@artsy/palette"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql } from "react-relay"
import { FairFixture } from "../../../__fixtures__"
import { FairHeaderContainer as FairHeader } from "../index"

jest.unmock("react-relay")

describe("FairHeader", () => {
  it("renders properly", async () => {
    const tree = await renderRelayTree({
      Component: (props: any) => (
        <Theme>
          <FairHeader {...props} />
        </Theme>
      ),
      query: graphql`
        query FairHeaderTestsQuery {
          fair(id: "sofa-chicago-2018") {
            ...FairHeader_fair
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

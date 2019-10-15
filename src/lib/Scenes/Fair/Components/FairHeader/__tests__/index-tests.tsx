import { Theme } from "@artsy/palette"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql } from "react-relay"
import { fairFixture } from "../../../__fixtures__"
import { FairHeaderContainer as FairHeader } from "../index"

jest.unmock("react-relay")

describe("FairHeader", () => {
  xit("renders properly", async () => {
    const tree = await renderRelayTree({
      Component: (props: any) => (
        <Theme>
          <FairHeader {...props} />
        </Theme>
      ),
      query: graphql`
        query indexTestsFairHeaderQuery @raw_response_type {
          fair(id: "sofa-chicago-2018") {
            ...FairHeader_fair
          }
        }
      `,
      mockData: {
        fair: fairFixture,
      }, // Enable/fix this when making large change to these components/fixtures: as indexTestsFairHeaderQueryRawResponse,
    })

    expect(tree.html()).toMatchSnapshot()
  })
})

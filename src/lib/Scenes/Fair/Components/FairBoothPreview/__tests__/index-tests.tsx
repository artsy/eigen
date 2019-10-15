import { Theme } from "@artsy/palette"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql } from "react-relay"
import { fairFixture } from "../../../__fixtures__"
import { FairBoothPreviewContainer } from "../index"

jest.unmock("react-relay")

describe("FairBoothPreview", () => {
  xit("renders properly", async () => {
    const tree = await renderRelayTree({
      Component: (props: any) => (
        <Theme>
          <FairBoothPreviewContainer {...props} />
        </Theme>
      ),
      query: graphql`
        query indexTestsFairBothPreviewQuery @raw_response_type {
          show(id: "abxy-blk-and-blue") {
            ...FairBoothPreview_show
          }
        }
      `,
      mockData: {
        fair: fairFixture,
      }, // Enable/fix this when making large change to these components/fixtures: as indexTestsFairBothPreviewQueryRawResponse,
    })

    expect(tree.html()).toMatchSnapshot()
  })
})

import { Theme } from "@artsy/palette"
import { FairBoothShowFixture } from "lib/__fixtures__/FairBoothShowFixture"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql } from "react-relay"
import { FairBoothHeaderContainer as FairBoothHeader } from "../FairBoothHeader"

jest.unmock("react-relay")

const render = () =>
  renderRelayTree({
    Component: ({ show }) => (
      <Theme>
        <FairBoothHeader onTitlePressed={jest.fn()} show={show} />
      </Theme>
    ),
    query: graphql`
      query FairBoothHeaderTestsQuery {
        show(id: "anderson-fine-art-gallery-flickinger-collection") {
          ...FairBoothHeader_show
        }
      }
    `,
    mockData: {
      data: FairBoothShowFixture,
    },
  })

describe("FairBoothHeader", () => {
  xit("Renders the Fair Booth Header", async () => {
    const tree = await render()
    expect(tree.html()).toMatchSnapshot()
  })
})

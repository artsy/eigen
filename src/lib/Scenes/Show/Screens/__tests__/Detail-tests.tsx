import { Theme } from "@artsy/palette"
import { DetailTestsQueryRawResponse } from "__generated__/DetailTestsQuery.graphql"
import React from "react"
import { graphql } from "react-relay"

import { ShowFixture } from "lib/__fixtures__/ShowFixture"

import { renderRelayTree } from "lib/tests/renderRelayTree"
import { DetailContainer } from "../Detail"

jest.unmock("react-relay")

it("Renders the Show Detail Screen", async () => {
  const tree = await renderRelayTree({
    Component: ({ show }) => {
      return (
        <Theme>
          <DetailContainer show={show} />
        </Theme>
      )
    },
    query: graphql`
      query DetailTestsQuery @raw_response_type {
        show(id: "anderson-fine-art-gallery-flickinger-collection") {
          ...Detail_show
        }
      }
    `,
    mockData: {
      show: ShowFixture,
    } as DetailTestsQueryRawResponse,
  })

  expect(tree.text()).toContain("Flickinger Collection")
})

describe("with missing schedule values", () => {
  it.todo("renders without (the missing) opening hours")
})

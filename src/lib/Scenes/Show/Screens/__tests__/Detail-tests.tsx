import { Theme } from "@artsy/palette"
import React from "react"
import { graphql } from "react-relay"

import { ShowFixture } from "lib/__fixtures__/ShowFixture"

import { renderRelayTree } from "lib/tests/renderRelayTree"
import { DetailContainer } from "../Detail"

jest.unmock("react-relay")

// FIXME: Fixture must be wrong
xit("Renders the Show Detail Screen", async () => {
  const tree = await renderRelayTree({
    Component: ({ show }) => {
      return (
        <Theme>
          <DetailContainer show={show} />
        </Theme>
      )
    },
    query: graphql`
      query DetailTestsQuery {
        show(id: "anderson-fine-art-gallery-flickinger-collection") {
          ...Detail_show
        }
      }
    `,
    mockData: {
      show: ShowFixture,
    },
  })

  expect(tree.text()).toContain("Flickinger Collection")
})

describe("with missing schedule values", () => {
  it.todo("renders without (the missing) opening hours")
})

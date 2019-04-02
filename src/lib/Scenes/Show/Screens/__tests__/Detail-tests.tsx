import { Theme } from "@artsy/palette"
import React from "react"
import { graphql } from "react-relay"

import { ShowFixture } from "lib/__fixtures__/ShowFixture"
import { MockRelayRenderer } from "../../../../tests/MockRelayRenderer"
import { renderUntil } from "../../../../tests/renderUntil"

import { ShowHeader } from "../../Components/ShowHeader"
import { DetailContainer } from "../Detail"

jest.unmock("react-relay")

it("Renders the Show Detail Screen", async () => {
  const tree = await renderUntil(
    wrapper => {
      return wrapper.find(ShowHeader).length > 0
    },
    <MockRelayRenderer
      Component={({ show }) => {
        return (
          <Theme>
            <DetailContainer show={show} />
          </Theme>
        )
      }}
      query={graphql`
        query DetailTestsQuery {
          show(id: "anderson-fine-art-gallery-flickinger-collection") {
            ...Detail_show
          }
        }
      `}
      mockData={{
        show: ShowFixture,
      }}
    />
  )

  expect(tree.text()).toContain("Flickinger Collection")
})

describe("with missing schedule values", () => {
  it.todo("renders without (the missing) opening hours")
})

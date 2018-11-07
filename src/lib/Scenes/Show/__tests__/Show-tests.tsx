import React from "react"
import { graphql } from "react-relay"

import { MockRelayRenderer } from "../../../tests/MockRelayRenderer"
import { renderUntil } from "../../../tests/renderUntil"
import { ShowFixture } from "../__fixtures__"

import { DetailContainer as ShowDetail } from "../Screens/Detail"
import { ShowContainer } from "../Show"

jest.unmock("react-relay")

const renderTree = () =>
  renderUntil(
    wrapper => wrapper.find(ShowDetail).length > 0,
    <MockRelayRenderer
      Component={ShowContainer}
      query={graphql`
        query ShowTestsQuery {
          show(id: "anderson-fine-art-gallery-flickinger-collection") {
            ...Show_show
          }
        }
      `}
      mockResolvers={{
        Show: () => ({
          ...ShowFixture,
          artists: () => ShowFixture.show.artists,
        }),
      }}
    />
  )

it("renders the Show screen", async () => {
  const tree = await renderTree()
  expect(tree.text()).toContain("Flickinger Collection")
})

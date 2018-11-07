import React from "react"
import { graphql } from "react-relay"

import { MockRelayRenderer } from "../../../../tests/MockRelayRenderer"
import { renderUntil } from "../../../../tests/renderUntil"
import { ShowFixture } from "../../__fixtures__"

import { MoreInfoContainer } from "../MoreInfo"

jest.unmock("react-relay")

it("Renders the Show MoreInfo screen", async () => {
  const tree = await renderUntil(
    wrapper => wrapper.text().includes("Press Release"),
    <MockRelayRenderer
      Component={MoreInfoContainer}
      query={graphql`
        query MoreInfoTestsQuery {
          show(id: "anderson-fine-art-gallery-flickinger-collection") {
            ...MoreInfo_show
          }
        }
      `}
      mockResolvers={{
        Show: () => ShowFixture,
      }}
    />
  )

  expect(tree.text()).toContain("Paintings and Sculpture from the Sea Island Estate of the Flickingers")
})

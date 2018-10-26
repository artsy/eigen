import React from "react"
import { graphql } from "react-relay"

import { MockRelayRenderer } from "../../../tests/MockRelayRenderer"
import { renderUntil } from "../../../tests/renderUntil"
import { ShowFixture } from "./fixtures"

import Show from "../"
import { Header } from "../Components/Header"
import OpaqueImageView from "lib/components/OpaqueImageView"

jest.unmock("react-relay")

it("Renders a show", async () => {
  const tree = await renderUntil(
    wrapper => {
      return wrapper.find(Header).length > 0
    },
    <MockRelayRenderer
      Component={Show}
      query={graphql`
        query indexTestsQuery {
          show(id: "anderson-fine-art-gallery-flickinger-collection") {
            ...Show_show
          }
        }
      `}
      mockResolvers={{
        Show: () => ShowFixture,
      }}
    />
  )

  expect(tree.text()).toContain("Flickinger Collection")
})

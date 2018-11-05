import React from "react"
import { graphql } from "react-relay"

import { MockRelayRenderer } from "../../../../tests/MockRelayRenderer"
import { renderUntil } from "../../../../tests/renderUntil"
import { ShowFixture } from "../../__fixtures__"

import { ShowHeader } from "../../Components/ShowHeader"
import { DetailContainer } from "../Detail"

jest.unmock("react-relay")

it("Renders the Show Detail Screen", async () => {
  const tree = await renderUntil(
    wrapper => {
      return wrapper.find(ShowHeader).length > 0
    },
    <MockRelayRenderer
      Component={DetailContainer}
      query={graphql`
        query DetailTestsQuery {
          show(id: "anderson-fine-art-gallery-flickinger-collection") {
            ...Detail_show
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

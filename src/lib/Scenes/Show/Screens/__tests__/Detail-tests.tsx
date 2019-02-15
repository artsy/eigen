import React from "react"
import { graphql } from "react-relay"

import { ShowFixture } from "lib/__fixtures__/ShowFixture"
import { MockRelayRenderer } from "../../../../tests/MockRelayRenderer"
import { renderUntil } from "../../../../tests/renderUntil"

import { ShowHeader } from "../../Components/ShowHeader"
import { DetailContainer } from "../Detail"

jest.unmock("react-relay")

jest.mock("../../../../Components/LocationMap/index.tsx", () => "LocationMap")

// Blocked by LD-158.
xit("Renders the Show Detail Screen", async () => {
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
        Show: () => ({
          ...ShowFixture,
          artists: () => ShowFixture.artists,
        }),
      }}
    />
  )

  expect(tree.text()).toContain("Flickinger Collection")
})

describe("with missing schedule values", () => {
  // Blocked by LD-158.
  pending("it renders without (the missing) opening hours")
})

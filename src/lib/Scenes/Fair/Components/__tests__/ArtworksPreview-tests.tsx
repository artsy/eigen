import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import { renderUntil } from "lib/tests/renderUntil"
import React from "react"
import { graphql } from "react-relay"
import { fairFixture } from "../../__fixtures__"
import { ArtworksPreviewContainer as ArtworksPreview } from "../ArtworksPreview"

jest.unmock("react-relay")

it("renders properly", async () => {
  const tree = await renderUntil(
    wrapper => {
      return wrapper.text().includes("All works")
    },
    <MockRelayRenderer
      Component={ArtworksPreview}
      query={graphql`
        query ArtworksPreviewTestsQuery {
          fair(id: "sofa-chicago-2018") {
            ...ArtworksPreview_fair
          }
        }
      `}
      mockResolvers={{
        Fair: () => fairFixture,
      }}
    />
  )

  expect(tree.html()).toMatchSnapshot()
})

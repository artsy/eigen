import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import { renderUntil } from "lib/tests/renderUntil"
import React from "react"
import { graphql } from "react-relay"
import { fairFixture } from "../../__fixtures__"
import { FairBMWArtActivation } from "../FairBMWArtActivation"

jest.unmock("react-relay")

it("renders properly", async () => {
  const tree = await renderUntil(
    wrapper => {
      return wrapper.find("FairBMWArtActivation").length > 0
    },
    <MockRelayRenderer
      Component={FairBMWArtActivation}
      query={graphql`
        query FairBMWArtActivationTestsQuery {
          fair(id: "art-basel-in-miami-beach-2018") {
            id
            _id
            sponsoredContent {
              activationText
              pressReleaseUrl
            }
          }
        }
      `}
      mockResolvers={{
        Fair: () => fairFixture,
      }}
    />
  )
  const dom = tree.text()

  expect(dom).toContain("BMW Art Activations")
  expect(dom).toContain(fairFixture.sponsoredContent.activationText)

  // @TODO: Add tests here for View Press Release button https://artsyproduct.atlassian.net/browse/LD-549
})

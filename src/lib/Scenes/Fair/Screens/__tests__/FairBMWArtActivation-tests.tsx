import { FairBMWArtActivationTestsQueryRawResponse } from "__generated__/FairBMWArtActivationTestsQuery.graphql"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import { graphql } from "react-relay"
import { fairFixture } from "../../__fixtures__"
import { FairBMWArtActivation } from "../FairBMWArtActivation"

jest.unmock("react-relay")

it("renders properly", async () => {
  const tree = await renderRelayTree({
    Component: FairBMWArtActivation,
    query: graphql`
      query FairBMWArtActivationTestsQuery @raw_response_type {
        fair(id: "art-basel-in-miami-beach-2018") {
          slug
          internalID
          sponsoredContent {
            activationText
            pressReleaseUrl
          }
        }
      }
    `,
    mockResolvers: {
      Fair: () => fairFixture,
    } as FairBMWArtActivationTestsQueryRawResponse,
  })
  const dom = tree.text()

  expect(dom).toContain("BMW Art Activations")
  expect(dom).toContain(fairFixture.sponsoredContent.activationText)

  // @TODO: Add tests here for View Press Release button https://artsyproduct.atlassian.net/browse/LD-549
})

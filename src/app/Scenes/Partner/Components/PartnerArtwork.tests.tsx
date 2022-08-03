import { PartnerArtworkTestsQuery } from "__generated__/PartnerArtworkTestsQuery.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperationRawPayload } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { PartnerArtworkFixture } from "./__fixtures__/PartnerArtwork-fixture"
import { PartnerArtworkFragmentContainer as PartnerArtwork } from "./PartnerArtwork"

describe("PartnerArtwork", () => {
  it("renders the artworks", async () => {
    const TestRenderer = () => (
      <QueryRenderer<PartnerArtworkTestsQuery>
        environment={getRelayEnvironment()}
        query={graphql`
          query PartnerArtworkTestsQuery @raw_response_type {
            partner(id: "anderson-fine-art-gallery-flickinger-collection") {
              ...PartnerArtwork_partner
            }
          }
        `}
        variables={{}}
        render={({ props, error }) => {
          if (props?.partner) {
            return <PartnerArtwork partner={props.partner} />
          } else if (error) {
            console.log(error)
          }
        }}
      />
    )

    renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperationRawPayload({
      errors: [],
      data: PartnerArtworkFixture,
    })
  })
})

import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer, { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

import { Theme } from "@artsy/palette"
import { PartnerArtworkTestsQuery } from "__generated__/PartnerArtworkTestsQuery.graphql"
import { PartnerArtworkFixture } from "../__fixtures__/PartnerArtwork-fixture"
import { PartnerArtworkFragmentContainer as PartnerArtwork } from "../PartnerArtwork"

jest.unmock("react-relay")

describe("PartnerArtwork", () => {
  it("renders the artworks", async () => {
    const env = createMockEnvironment()
    const TestRenderer = () => (
      <QueryRenderer<PartnerArtworkTestsQuery>
        environment={env}
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
            return (
              <Theme>
                <PartnerArtwork partner={props.partner} />
              </Theme>
            )
          } else if (error) {
            console.log(error)
          }
        }}
      />
    )

    ReactTestRenderer.create(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: PartnerArtworkFixture,
      })
    })
  })
})

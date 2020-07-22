import { Theme } from "@artsy/palette"
import { ViewingRoomsListFeaturedTestsQuery } from "__generated__/ViewingRoomsListFeaturedTestsQuery.graphql"
import { MediumCard } from "@artsy/palette"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { QueryRenderer } from "react-relay"
import ReactTestRenderer from "react-test-renderer"
import { graphql, RelayEnvironmentProvider } from "relay-hooks"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { FeaturedRail } from "../ViewingRoomsListFeatured"

jest.unmock("react-relay")

describe(FeaturedRail, () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <Theme>
      <RelayEnvironmentProvider environment={mockEnvironment}>
        <QueryRenderer<ViewingRoomsListFeaturedTestsQuery>
          environment={mockEnvironment}
          query={graphql`
            query ViewingRoomsListFeaturedTestsQuery {
              featured: viewingRooms(featured: true) {
                ...ViewingRoomsListFeatured_featured
              }
            }
          `}
          variables={{}}
          render={renderWithLoadProgress(FeaturedRail)}
        />
      </RelayEnvironmentProvider>
    </Theme>
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("shows some cards", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation =>
      MockPayloadGenerator.generate(operation, {
        Query: () => ({
          featured: {
            edges: [
              {
                node: {
                  title: "ok",
                  href:
                    "/viewing-room/zero-dot-dot-dot-alessandro-pessoli/alessandro-pessoli-ardente-primavera-number-1",
                  slug: "alessandro-pessoli-ardente-primavera-number-1",
                  internalID: "one",
                },
              },
              {
                node: {
                  title: "oak",
                  href:
                    "/viewing-room/zero-dot-dot-dot-alessandro-pessoli/alessandro-pessoli-ardente-primavera-number-1",
                  slug: "alessand-pessoli-ardente-primavera-number-1",
                  internalID: "two",
                },
              },
            ],
          },
        }),
      })
    )

    expect(tree.root.findAllByType(MediumCard)).toHaveLength(2)
  })
})

import { ViewingRoomsListFeaturedTestsQuery } from "__generated__/ViewingRoomsListFeaturedTestsQuery.graphql"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { MediumCard } from "palette"
import React from "react"
import { graphql, QueryRenderer, RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { FeaturedRail } from "./ViewingRoomsListFeatured"

jest.unmock("react-relay")

describe(FeaturedRail, () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
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
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("shows some cards", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Query: () => ({
          featured: {
            edges: [
              {
                node: {
                  title: "ok",
                  href: "/viewing-room/zero-dot-dot-dot-alessandro-pessoli/alessandro-pessoli-ardente-primavera-number-1",
                  slug: "alessandro-pessoli-ardente-primavera-number-1",
                  internalID: "one",
                },
              },
              {
                node: {
                  title: "oak",
                  href: "/viewing-room/zero-dot-dot-dot-alessandro-pessoli/alessandro-pessoli-ardente-primavera-number-1",
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

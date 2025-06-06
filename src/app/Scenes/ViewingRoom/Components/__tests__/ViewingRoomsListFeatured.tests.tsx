import { ViewingRoomsListFeaturedTestsQuery } from "__generated__/ViewingRoomsListFeaturedTestsQuery.graphql"
import { MediumCard } from "app/Components/Cards"
import { FeaturedRail } from "app/Scenes/ViewingRoom/Components/ViewingRoomsListFeatured"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer, RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

describe(FeaturedRail, () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <QueryRenderer<ViewingRoomsListFeaturedTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query ViewingRoomsListFeaturedTestsQuery {
            featured: viewingRoomsConnection(featured: true) {
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
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
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

import { ViewingRoomsListFeaturedTestsQuery } from "__generated__/ViewingRoomsListFeaturedTestsQuery.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { MediumCard } from "palette"
import { graphql, QueryRenderer, RelayEnvironmentProvider } from "react-relay"
import { FeaturedRail } from "./ViewingRoomsListFeatured"

describe(FeaturedRail, () => {
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={getRelayEnvironment()}>
      <QueryRenderer<ViewingRoomsListFeaturedTestsQuery>
        environment={getRelayEnvironment()}
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

  it("shows some cards", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
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

    expect(tree.root.findAllByType(MediumCard)).toHaveLength(2)
  })
})

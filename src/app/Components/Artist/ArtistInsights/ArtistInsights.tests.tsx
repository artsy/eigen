import { ArtistInsightsTestsQuery } from "__generated__/ArtistInsightsTestsQuery.graphql"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { ArtistInsightsFragmentContainer } from "./ArtistInsights"
import { ArtistInsightsAuctionResultsPaginationContainer } from "./ArtistInsightsAuctionResults"

const trackEvent = useTracking().trackEvent

describe("ArtistInsights", () => {
  const TestRenderer = ({ tabIndex = 0 }) => (
    <QueryRenderer<ArtistInsightsTestsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query ArtistInsightsTestsQuery @relay_test_operation {
          artist(id: "some-id") {
            ...ArtistInsights_artist
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (!props?.artist) {
          return null
        }
        return (
          <StickyTabPage
            tabs={[
              {
                title: "test",
                content: (
                  <ArtistInsightsFragmentContainer artist={props.artist} tabIndex={tabIndex} />
                ),
              },
            ]}
          />
        )
      }}
    />
  )

  it("renders list auction results", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root
    resolveMostRecentRelayOperation()
    expect(tree.findAllByType(ArtistInsightsAuctionResultsPaginationContainer).length).toEqual(1)
  })

  it("tracks an auction page view when artist insights is current tab", (done) => {
    renderWithWrappersLEGACY(<TestRenderer tabIndex={0} />)

    resolveMostRecentRelayOperation()

    setImmediate(() => {
      expect(trackEvent).toHaveBeenCalledWith({
        action: "screen",
        context_screen_owner_id: "internalID-1",
        context_screen_owner_slug: "slug-1",
        context_screen_owner_type: "artistAuctionResults",
      })

      done()
    })
  })
})

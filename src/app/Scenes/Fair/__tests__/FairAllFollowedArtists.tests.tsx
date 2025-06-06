import { screen } from "@testing-library/react-native"
import { FairAllFollowedArtistsTestsQuery } from "__generated__/FairAllFollowedArtistsTestsQuery.graphql"
import { FairAllFollowedArtistsFragmentContainer } from "app/Scenes/Fair/FairAllFollowedArtists"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("FairAllFollowedArtists", () => {
  const { renderWithRelay } = setupTestWrapper<FairAllFollowedArtistsTestsQuery>({
    Component: (props) => (
      <FairAllFollowedArtistsFragmentContainer
        fair={props.fair}
        fairForFilters={props.fairForFilters}
      />
    ),
    query: graphql`
      query FairAllFollowedArtistsTestsQuery {
        fair(id: "fair-id") @required(action: NONE) {
          ...FairAllFollowedArtists_fair
        }
        fairForFilters: fair(id: "fair-id") @required(action: NONE) {
          ...FairAllFollowedArtists_fairForFilters
        }
      }
    `,
  })

  it("shows empty state when there are no artworks", async () => {
    renderWithRelay({
      FilterArtworksConnection() {
        return {
          counts: {
            total: 0,
          },
          edges: [],
        }
      },
    })

    await flushPromiseQueue()

    expect(screen.getByText(/No results found/)).toBeOnTheScreen()
  })
})

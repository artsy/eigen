import { screen } from "@testing-library/react-native"
import { FairAllFollowedArtistsTestsQuery } from "__generated__/FairAllFollowedArtistsTestsQuery.graphql"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { FairAllFollowedArtistsFragmentContainer } from "./FairAllFollowedArtists"

describe("FairAllFollowedArtists", () => {
  const { renderWithRelay } = setupTestWrapper<FairAllFollowedArtistsTestsQuery>({
    Component: FairAllFollowedArtistsFragmentContainer,
    query: graphql`
      query FairAllFollowedArtistsTestsQuery @relay_test_operation {
        fair(id: "fair-id") @required(action: NONE) {
          ...FairAllFollowedArtists_fair
        }
        fairForFilters: fair(id: "fair-id") @required(action: NONE) {
          ...FairAllFollowedArtists_fairForFilters
        }
      }
    `,
  })

  it.only("renders", () => {
    renderWithRelay()

    expect(screen.getByText("Artworks")).toBeOnTheScreen()
  })
})

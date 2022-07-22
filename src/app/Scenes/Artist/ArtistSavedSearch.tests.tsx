import { fireEvent, screen, within } from "@testing-library/react-native"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import {
  rejectMostRecentRelayOperation,
  resolveMostRecentRelayOperation,
} from "app/tests/resolveMostRecentRelayOperation"
import { ArtistQueryRenderer } from "./Artist"

describe("Saved search banner on artist screen", () => {
  const TestRenderer = ({ searchCriteriaID }: { searchCriteriaID?: string }) => (
    <ArtistQueryRenderer
      artistID="ignored"
      environment={getRelayEnvironment()}
      searchCriteriaID={searchCriteriaID}
    />
  )

  it("should convert the criteria attributes to the filter params format", async () => {
    renderWithWrappers(<TestRenderer searchCriteriaID="search-criteria-id" />)

    resolveMostRecentRelayOperation(MockSearchCriteriaQuery)
    resolveMostRecentRelayOperation(MockArtistAboveTheFoldQuery)

    fireEvent.press(screen.getByText("Sort & Filter"))

    expect(within(screen.getByText("Sort By")).getByText("• 1")).toBeTruthy()
    expect(within(screen.getByText("Rarity")).getByText("• 2")).toBeTruthy()
    expect(within(screen.getByText("Ways to Buy")).getByText("• 2")).toBeTruthy()
  })

  it("should an error message when something went wrong during the search criteria query", async () => {
    renderWithWrappers(<TestRenderer searchCriteriaID="something" />)

    rejectMostRecentRelayOperation(new Error())
    resolveMostRecentRelayOperation(MockArtistAboveTheFoldQuery)

    expect(screen.getByText("Sorry, an error occured")).toBeTruthy()
    expect(screen.getByText("Failed to get saved search criteria")).toBeTruthy()
  })

  it("should render saved search component", async () => {
    renderWithWrappers(<TestRenderer searchCriteriaID="search-criteria-id" />)

    resolveMostRecentRelayOperation(MockSearchCriteriaQuery)
    resolveMostRecentRelayOperation(MockArtistAboveTheFoldQuery)

    expect(screen.getAllByText("Create Alert")).not.toHaveLength(0)
  })
})

const MockSearchCriteriaQuery = {
  Me() {
    return {
      savedSearch: {
        attributionClass: ["limited edition", "open edition"],
        acquireable: true,
        inquireableOnly: true,
        offerable: null,
        atAuction: null,
        width: null,
        height: null,
      },
    }
  },
}
const MockArtistAboveTheFoldQuery = {
  Artist() {
    return {
      has_metadata: true,
      counts: { articles: 0, related_artists: 0, artworks: 1, partner_shows: 0 },
      auctionResultsConnection: {
        totalCount: 0,
      },
    }
  },
}

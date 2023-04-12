import { act, fireEvent } from "@testing-library/react-native"
import { ArtistAutosuggestResultsPaginationQuery } from "__generated__/ArtistAutosuggestResultsPaginationQuery.graphql"
import { navigate } from "app/system/navigation/navigate"
import { defaultEnvironment } from "app/system/relay/createEnvironment"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithHookWrappersTL, renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { createMockEnvironment } from "relay-test-utils"
import { PriceDatabase } from "./PriceDatabase"

const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

describe(PriceDatabase, () => {
  it("renders the price database", () => {
    const { getByText } = renderWithHookWrappersTL(<PriceDatabase />, mockEnvironment)

    expect(getByText("Artsy Price")).toBeTruthy()
    expect(getByText("Database")).toBeTruthy()

    expect(
      getByText("Unlimited access to millions of auction results and art market data — for free.")
    ).toBeTruthy()
  })

  it("searches for artist's auction results without filters", async () => {
    const { getByText, getByPlaceholderText } = renderWithWrappers(<PriceDatabase />)

    fireEvent.changeText(getByPlaceholderText("Search by artist name"), "banksy")

    act(() =>
      mockEnvironment.mock.resolveMostRecentOperation({ errors: [], data: mockArtistSearchResult })
    )

    fireEvent.press(getByText("Banksy"))

    fireEvent.press(getByText("Search"))

    expect(navigate).toHaveBeenCalledWith(
      "/artist/4dd1584de0091e000100207c/auction-results?scroll_to_market_signals=true"
    )

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "searchedPriceDatabase",
      context_module: "priceDatabaseLanding",
      context_owner_type: "priceDatabase",
      destination_owner_id: "4dd1584de0091e000100207c",
      destination_owner_type: "artistAuctionResults",
      destination_path:
        "/artist/4dd1584de0091e000100207c/auction-results?scroll_to_market_signals=true",
      filters: '{"categories":[],"sizes":[]}',
      query: "",
    })
  })

  it("searches for artist's auction results with filters", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = renderWithWrappers(<PriceDatabase />)

    fireEvent.changeText(getByPlaceholderText("Search by artist name"), "banksy")

    act(() =>
      mockEnvironment.mock.resolveMostRecentOperation({ errors: [], data: mockArtistSearchResult })
    )

    // Select artist

    fireEvent.press(getByText("Banksy"))

    // Select medium

    fireEvent.press(getByText("Medium"))

    fireEvent.press(getByText("Painting"))
    fireEvent.press(getByText("Work on paper"))

    fireEvent.press(getByTestId("artwork-filter-header-back-button"))

    // Select sizes

    fireEvent.press(getByText("Size"))

    fireEvent.press(getByText("Small (under 16in)"))
    fireEvent.press(getByText("Medium (16 – 40in)"))
    fireEvent.press(getByText("Large (over 40in)"))

    fireEvent.press(getByTestId("artwork-filter-header-back-button"))

    fireEvent.press(getByText("Search"))

    expect(navigate).toHaveBeenCalledWith(
      "/artist/4dd1584de0091e000100207c/auction-results?categories=Painting&categories=Work%20on%20Paper&sizes=&scroll_to_market_signals=true"
    )

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "searchedPriceDatabase",
      context_module: "priceDatabaseLanding",
      context_owner_type: "priceDatabase",
      destination_owner_id: "4dd1584de0091e000100207c",
      destination_owner_type: "artistAuctionResults",
      destination_path:
        "/artist/4dd1584de0091e000100207c/auction-results?categories=Painting&categories=Work%20on%20Paper&sizes=&scroll_to_market_signals=true",
      filters: '{"categories":["Painting","Work on Paper"],"sizes":[null]}',
      query: "categories=Painting&categories=Work%20on%20Paper&sizes=",
    })
  })
  describe("when no artist is selected", () => {
    it("disables the search button", async () => {
      const { getByText } = renderWithWrappers(<PriceDatabase />)

      fireEvent.press(getByText("Search"))

      expect(navigate).not.toHaveBeenCalled()
    })
  })
})

const mockArtistSearchResult: ArtistAutosuggestResultsPaginationQuery["rawResponse"] = {
  results: {
    edges: [
      {
        node: {
          imageUrl: "https://d32dm0rphc51dk.cloudfront.net/X9vVvod7QY73ZwLDSZzljw/square.jpg",
          href: "/artist/banksy",
          displayLabel: "Banksy",
          __typename: "Artist",
          internalID: "4dd1584de0091e000100207c",
          formattedNationalityAndBirthday: "British, b. 1974",
          slug: "banksy",
          statuses: { artworks: true, auctionLots: true },
          __isNode: "Artist",
          id: "QXJ0aXN0OjRkZDE1ODRkZTAwOTFlMDAwMTAwMjA3Yw==",
        },
        cursor: "YXJyYXljb25uZWN0aW9uOjU=",
      },
    ],
    pageInfo: { endCursor: "YXJyYXljb25uZWN0aW9uOjMx", hasNextPage: true },
  },
}

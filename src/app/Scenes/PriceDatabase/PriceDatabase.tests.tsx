import { act, fireEvent } from "@testing-library/react-native"
import { ArtistAutosuggestResultsPaginationQuery } from "__generated__/ArtistAutosuggestResultsPaginationQuery.graphql"
import { navigate } from "app/system/navigation/navigate"
import { defaultEnvironment } from "app/system/relay/createEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
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

    // expect(mockTrackEvent).toHaveBeenCalledWith({
    //   action: "screen",
    //   context_screen_owner_type: "priceDatabase",
    // })
  })

  it("searches for artist's auction results without filters", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = renderWithWrappers(<PriceDatabase />)

    fireEvent.changeText(getByPlaceholderText("Search by artist name"), "banksy")

    act(() =>
      mockEnvironment.mock.resolveMostRecentOperation({ errors: [], data: mockArtistSearchResult })
    )

    await flushPromiseQueue()

    fireEvent.press(getByText("Banksy"))

    await flushPromiseQueue()

    fireEvent.press(getByText("Search"))

    expect(navigate).toHaveBeenCalledWith(
      "/artist/4dd1584de0091e000100207c/auction-results?scroll_to_market_signals=true"
    )
    // getByText("Search").props.onPress()

    // wrapper
    //   .find(PriceDatabaseArtistAutosuggest)
    //   .props()
    //   .onChange("gerhard-richter")
    // wrapper.find(Button).simulate("click")

    // expect(mockRouterPush).toHaveBeenCalledWith(
    //   "/artist/gerhard-richter/auction-results?scroll_to_market_signals=true"
    // )

    // expect(trackEvent).toHaveBeenCalledTimes(1)
    // expect(trackEvent.mock.calls[0][0]).toMatchInlineSnapshot(`
    //   Object {
    //     "action": "searchedPriceDatabase",
    //     "context_module": "priceDatabaseLanding",
    //     "context_owner_type": "priceDatabase",
    //     "destination_owner_slug": "gerhard-richter",
    //     "destination_owner_type": "artistAuctionResults",
    //     "destination_path": "/artist/gerhard-richter/auction-results",
    //     "filters": "{\\"categories\\":[],\\"sizes\\":[]}",
    //     "query": "",
    //   }
    // `)
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

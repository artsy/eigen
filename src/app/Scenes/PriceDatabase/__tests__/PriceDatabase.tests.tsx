import { act, fireEvent, screen } from "@testing-library/react-native"
import { ArtistAutosuggestResultsPaginationQuery } from "__generated__/ArtistAutosuggestResultsPaginationQuery.graphql"
import { PriceDatabase } from "app/Scenes/PriceDatabase/PriceDatabase"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import * as navigation from "app/system/navigation/navigate"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithHookWrappersTL, renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { createMockEnvironment } from "relay-test-utils"

describe(PriceDatabase, () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const navigate = jest.spyOn(navigation, "navigate")

  beforeEach(() => {
    mockEnvironment = getMockRelayEnvironment()
    jest.clearAllMocks()
  })

  it("renders the price database", async () => {
    await renderWithHookWrappersTL(<PriceDatabase />, mockEnvironment)

    expect(screen.getByText("Artsy Price Database")).toBeTruthy()

    expect(
      screen.getByText(
        "Unlimited access to millions of auction results and art market data — for free."
      )
    ).toBeTruthy()
  })

  it("renders the price database benefits", async () => {
    await renderWithHookWrappersTL(<PriceDatabase />, mockEnvironment)

    expect(screen.getByText("Get in-depth art market data")).toBeTruthy()
    expect(
      screen.getByText(
        "Browse millions of current and historical results from leading auction houses across the globe."
      )
    ).toBeTruthy()

    expect(screen.getByText("Research and validate prices")).toBeTruthy()
    expect(
      screen.getByText(
        "Access the data you need to make the right decisions for your collection, whether you’re researching, buying, or selling."
      )
    ).toBeTruthy()

    expect(screen.getByText("Search for free")).toBeTruthy()
    expect(
      screen.getByText(
        "The Artsy Price Database is for every collector—with no search limits, no subscriptions, and no obligations. A more open art world starts here."
      )
    ).toBeTruthy()
  })

  describe("Search", () => {
    describe("without filters", () => {
      it("searches for artist's auction results", async () => {
        await renderWithWrappers(<PriceDatabase />)

        await fireEvent.changeText(
          screen.getByPlaceholderText("Search by artist name"),
          "andy-warhol"
        )

        await act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({
            errors: [],
            data: mockArtistSearchResult,
          })
        )

        // Select artist

        await fireEvent.press(screen.getByText("Andy Warhol"))

        await fireEvent.press(screen.getByText("Search"))

        expect(navigate).toHaveBeenCalledWith(
          "/artist/andy-warhol/auction-results?scroll_to_market_signals=true"
        )

        expect(mockTrackEvent).toHaveBeenCalledWith({
          action: "searchedPriceDatabase",
          context_module: "priceDatabaseLanding",
          context_owner_type: "priceDatabase",
          destination_owner_slug: "andy-warhol",
          destination_owner_type: "artistAuctionResults",
          destination_path: "/artist/andy-warhol/auction-results?scroll_to_market_signals=true",
          filters: '{"categories":[],"sizes":[]}',
          query: "",
        })
      })
    })

    describe("with filters", () => {
      describe("when prefered metric is in", () => {
        it("searches for filtered artist's auction results", async () => {
          __globalStoreTestUtils__?.injectState({
            userPrefs: {
              metric: "in",
            },
          })

          await renderWithWrappers(<PriceDatabase />)

          await fireEvent.changeText(
            screen.getByPlaceholderText("Search by artist name"),
            "andy-warhol"
          )

          await act(() =>
            mockEnvironment.mock.resolveMostRecentOperation({
              errors: [],
              data: mockArtistSearchResult,
            })
          )

          // Select artist

          await fireEvent.press(screen.getByText("Andy Warhol"))

          // Select medium

          await fireEvent.press(screen.getByText("Medium"))

          await fireEvent.press(screen.getByText("Painting"))
          await fireEvent.press(screen.getByText("Work on paper"))

          await fireEvent.press(screen.getByTestId("artwork-filter-header-back-button"))

          // Select sizes

          await fireEvent.press(screen.getByText("Size"))

          await fireEvent.press(screen.getByText("Small (under 16in)"))
          await fireEvent.press(screen.getByText("Medium (16 – 40in)"))
          await fireEvent.press(screen.getByText("Large (over 40in)"))

          await fireEvent.press(screen.getByTestId("artwork-filter-header-back-button"))

          await fireEvent.press(screen.getByText("Search"))

          expect(navigate).toHaveBeenCalledWith(
            "/artist/andy-warhol/auction-results?categories[0]=Painting&categories[1]=Work%20on%20Paper&sizes[0]=SMALL&sizes[1]=MEDIUM&sizes[2]=LARGE&scroll_to_market_signals=true"
          )

          expect(mockTrackEvent).toHaveBeenCalledWith({
            action: "searchedPriceDatabase",
            context_module: "priceDatabaseLanding",
            context_owner_type: "priceDatabase",
            destination_owner_slug: "andy-warhol",
            destination_owner_type: "artistAuctionResults",
            destination_path:
              "/artist/andy-warhol/auction-results?categories[0]=Painting&categories[1]=Work%20on%20Paper&sizes[0]=SMALL&sizes[1]=MEDIUM&sizes[2]=LARGE&scroll_to_market_signals=true",
            filters:
              '{"categories":["Painting","Work on Paper"],"sizes":["SMALL","MEDIUM","LARGE"]}',
            query:
              "categories[0]=Painting&categories[1]=Work%20on%20Paper&sizes[0]=SMALL&sizes[1]=MEDIUM&sizes[2]=LARGE",
          })
        })
      })

      describe("when prefered metric is cm", () => {
        it("searches for filtered artist's auction results", async () => {
          __globalStoreTestUtils__?.injectState({
            userPrefs: {
              metric: "cm",
            },
          })

          await renderWithWrappers(<PriceDatabase />)

          await fireEvent.changeText(
            screen.getByPlaceholderText("Search by artist name"),
            "andy-warhol"
          )

          await act(() =>
            mockEnvironment.mock.resolveMostRecentOperation({
              errors: [],
              data: mockArtistSearchResult,
            })
          )

          // Select artist

          await fireEvent.press(screen.getByText("Andy Warhol"))

          // Select medium

          await fireEvent.press(screen.getByText("Medium"))

          await fireEvent.press(screen.getByText("Painting"))
          await fireEvent.press(screen.getByText("Work on paper"))

          await fireEvent.press(screen.getByTestId("artwork-filter-header-back-button"))

          // Select sizes

          await fireEvent.press(screen.getByText("Size"))

          await fireEvent.press(screen.getByText("Small (under 40cm)"))
          await fireEvent.press(screen.getByText("Medium (40 – 100cm)"))
          await fireEvent.press(screen.getByText("Large (over 100cm)"))

          await fireEvent.press(screen.getByTestId("artwork-filter-header-back-button"))

          await fireEvent.press(screen.getByText("Search"))

          expect(navigate).toHaveBeenCalledWith(
            "/artist/andy-warhol/auction-results?categories[0]=Painting&categories[1]=Work%20on%20Paper&sizes[0]=SMALL&sizes[1]=MEDIUM&sizes[2]=LARGE&scroll_to_market_signals=true"
          )

          expect(mockTrackEvent).toHaveBeenCalledWith({
            action: "searchedPriceDatabase",
            context_module: "priceDatabaseLanding",
            context_owner_type: "priceDatabase",
            destination_owner_slug: "andy-warhol",
            destination_owner_type: "artistAuctionResults",
            destination_path:
              "/artist/andy-warhol/auction-results?categories[0]=Painting&categories[1]=Work%20on%20Paper&sizes[0]=SMALL&sizes[1]=MEDIUM&sizes[2]=LARGE&scroll_to_market_signals=true",
            filters:
              '{"categories":["Painting","Work on Paper"],"sizes":["SMALL","MEDIUM","LARGE"]}',
            query:
              "categories[0]=Painting&categories[1]=Work%20on%20Paper&sizes[0]=SMALL&sizes[1]=MEDIUM&sizes[2]=LARGE",
          })
        })
      })
    })

    describe("when no artist is selected", () => {
      it("disables the search button", async () => {
        await renderWithWrappers(<PriceDatabase />)

        await fireEvent.press(screen.getByText("Search"))

        expect(navigate).not.toHaveBeenCalled()
      })
    })
  })
})

const mockArtistSearchResult: ArtistAutosuggestResultsPaginationQuery["rawResponse"] = {
  results: {
    edges: [
      {
        node: {
          imageUrl: "https://d32dm0rphc51dk.cloudfront.net/X9vVvod7QY73ZwLDSZzljw/square.jpg",
          href: "/artist/andy-warhol",
          displayLabel: "Andy Warhol",
          __typename: "Artist",
          internalID: "4dd1584de0091e000100207c",
          formattedNationalityAndBirthday: "British, b. 1974",
          slug: "andy-warhol",
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

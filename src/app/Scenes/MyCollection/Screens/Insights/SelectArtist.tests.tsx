import { act, fireEvent, screen } from "@testing-library/react-native"
import { MedianSalePriceAtAuctionQuery } from "__generated__/MedianSalePriceAtAuctionQuery.graphql"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import {
  MedianSalePriceAtAuction,
  MedianSalePriceAtAuctionScreenQuery,
} from "./MedianSalePriceAtAuction"

describe.skip("SelectArtist", () => {
  const TestRenderer = () => {
    useLazyLoadQuery<MedianSalePriceAtAuctionQuery>(MedianSalePriceAtAuctionScreenQuery, {
      artistID: "artist-id",
      count: 10,
      artistId: "artist-id",
    })

    return <MedianSalePriceAtAuction artistID="artist-id" initialCategory="Painting" />
  }

  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  describe("when changing an artist from artists list", () => {
    fit("should update the selected artist", async () => {
      renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      act(() => {
        mockEnvironment.mock.resolveMostRecentOperation({ data: mockResult })
      })

      // Check initial artist is selected
      await screen.findByText("Andy Warhol")

      fireEvent.press(screen.getByTestId("change-artist-touchable"))

      // Modal is visible and the list is populated
      expect(screen.getByTestId("select-artist-modal").props.visible).toBeTrue()
      expect(screen.getByTestId("select-artist-flatlist").props.data.length).toBe(3)

      // Press on Banksy
      fireEvent.press(screen.getByTestId("artist-section-item-Banksy"))

      // fetch Banksy data
      act(() => {
        mockEnvironment.mock.resolveMostRecentOperation({
          data: {
            artist: { internalID: "artist-id", name: "Banksy", imageUrl: "image-url" },
            ...insights,
          },
        })
      })

      // Modal is hidden and the artist is updated
      await flushPromiseQueue()

      expect(screen.getByText("Banksy")).toBeTruthy()
    })
  })

  describe("when searching for an artist in artists list", () => {
    it("should update the list of artists if the artist name is in the list", async () => {
      renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      act(() => {
        mockEnvironment.mock.resolveMostRecentOperation({ data: mockResult })
      })

      await screen.findByTestId("change-artist-touchable")
      fireEvent.press(screen.getByTestId("change-artist-touchable"))

      // Modal is visible and the section list is populated
      expect(screen.getByTestId("select-artist-modal").props.visible).toBeTrue()
      expect(screen.getByTestId("select-artist-flatlist").props.data.length).toBe(3)

      // Search for "Boafo"
      const searchInput = screen.getByTestId("select-artists-search-input")

      fireEvent(searchInput, "focus")
      fireEvent(searchInput, "changeText", "Boafo")

      // Flatlist is showing
      expect(screen.getByTestId("select-artist-flatlist")).toBeTruthy()
      expect(screen.getByTestId("select-artist-flatlist").props.data.length).toBe(1)

      // Amoako Boafo is in the results list
      expect(screen.getByTestId("artist-section-item-Amoako Boafo")).toBeTruthy()

      // Press on Amoako Boafo
      fireEvent.press(screen.getByTestId("artist-section-item-Amoako Boafo"))

      // fetch Amoako Boafo data
      act(() => {
        mockEnvironment.mock.resolveMostRecentOperation({
          data: {
            artist: { internalID: "artist-id", name: "Amoako Boafo", imageUrl: "image-url" },
            ...insights,
          },
        })
      })

      // Wait for modal to be dismissed
      await flushPromiseQueue()

      // Modal is hidden and the artist is updated
      expect(screen.getByText("Amoako Boafo")).toBeTruthy()
    })

    it("should display an error message if the artist name is not in the list", async () => {
      renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      act(() => {
        mockEnvironment.mock.resolveMostRecentOperation({ data: mockResult })
      })

      await screen.findByTestId("change-artist-touchable")
      fireEvent.press(screen.getByTestId("change-artist-touchable"))

      // Modal is visible and the section list is populated
      expect(screen.getByTestId("select-artist-modal").props.visible).toBeTrue()
      expect(screen.getByTestId("select-artist-flatlist").props.data.length).toBe(3)

      // Search for "Artist doesn't exist"
      const searchInput = screen.getByTestId("select-artists-search-input")

      fireEvent(searchInput, "focus")
      fireEvent(searchInput, "changeText", "Artist doesn't exist")

      // Flatlist is showing
      expect(screen.getByTestId("select-artist-flatlist")).toBeTruthy()
      expect(screen.getByTestId("select-artist-flatlist").props.data.length).toBe(0)

      // Error message is displayed
      expect(
        screen.getByText(
          "Please select from the list of artists in your collection with insights available."
        )
      ).toBeTruthy()
    })
  })
})

const mockResult = {
  artist: {
    internalID: "artist-id",
    name: "Andy Warhol",
    imageUrl: "image-url",
  },
  me: {
    myCollectionInfo: {
      artistsCount: 3,
    },
    userInterestsConnection: {
      edges: [
        {
          node: {
            __typename: "Artist",
            id: "QXJ0aXN0OjRkOGI5MmIzNGViNjhhMWIyYzAwMDNmNA==",
            internalID: "4d8b92b34eb68a1b2c0003f4",
            name: "Andy Warhol",
            initials: "AW",
            formattedNationalityAndBirthday: "American, 1928–1987",
            imageUrl: "https://d32dm0rphc51dk.cloudfront.net/E-k-uLoQADM8AjadsSKHrA/square.jpg",
          },
        },
        {
          node: {
            __typename: "Artist",
            id: "QXJ0aXN0OjRkZDE1ODRkZTAwOTFlMDAwMTAwMjA3Yw==",
            internalID: "4dd1584de0091e000100207c",
            name: "Banksy",
            initials: "B",
            formattedNationalityAndBirthday: "British, b. 1974",
            imageUrl: "https://d32dm0rphc51dk.cloudfront.net/X9vVvod7QY73ZwLDSZzljw/square.jpg",
          },
        },
        {
          node: {
            __typename: "Artist",
            id: "QXJ0aXN0OjVjMzQxNTU5ZmM1NDY5NDQ1ZGJkMjM2Yg==",
            internalID: "5c341559fc5469445dbd236b",
            name: "Amoako Boafo",
            initials: "AB",
            formattedNationalityAndBirthday: "Ghanaian, b. 1984",
            imageUrl: "https://d32dm0rphc51dk.cloudfront.net/bBBIgjEwR2o9C_7BqJ6YPw/square.jpg",
          },
        },
      ],
    },
  },
}

const insights = {
  analyticsCalendarYearPriceInsights: [
    {
      calendarYearMarketPriceInsights: [
        { lotsSold: "7", medianSalePrice: "9654000", year: "2014" },
        { lotsSold: "9", medianSalePrice: "8460000", year: "2015" },
        { lotsSold: "7", medianSalePrice: "7532000", year: "2016" },
        { lotsSold: "14", medianSalePrice: "11741000", year: "2017" },
        { lotsSold: "19", medianSalePrice: "34367000", year: "2018" },
        { lotsSold: "15", medianSalePrice: "41405000", year: "2019" },
        { lotsSold: "17", medianSalePrice: "93000000", year: "2020" },
        { lotsSold: "27", medianSalePrice: "119232000", year: "2021" },
        { lotsSold: "9", medianSalePrice: "130423000", year: "2022" },
      ],
      medium: "Painting",
    },
  ],
  priceInsights: {
    nodes: [
      {
        lotsSoldLast36Months: 31,
        lotsSoldLast96Months: 77,
        medianSalePriceLast36Months: "335000",
        medianSalePriceLast96Months: "245000",
        medium: "Sculpture",
      },
      {
        lotsSoldLast36Months: 841,
        lotsSoldLast96Months: 1327,
        medianSalePriceLast36Months: "6178000",
        medianSalePriceLast96Months: "3836000",
        medium: "Print",
      },
      {
        lotsSoldLast36Months: 64,
        lotsSoldLast96Months: 119,
        medianSalePriceLast36Months: "93000000",
        medianSalePriceLast96Months: "41653000",
        medium: "Painting",
      },
      {
        lotsSoldLast36Months: 20,
        lotsSoldLast96Months: 48,
        medianSalePriceLast36Months: "11930000",
        medianSalePriceLast96Months: "4372000",
        medium: "Work on Paper",
      },
      {
        lotsSoldLast36Months: 13,
        lotsSoldLast96Months: 13,
        medianSalePriceLast36Months: "34968000",
        medianSalePriceLast96Months: "34968000",
        medium: "Unknown",
      },
    ],
  },
}

import { MedianSalePriceAtAuctionQuery } from "__generated__/MedianSalePriceAtAuctionQuery.graphql"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import {
  MedianSalePriceAtAuction,
  MedianSalePriceAtAuctionScreenQuery,
} from "./MedianSalePriceAtAuction"

jest.unmock("react-relay")

describe("SelectArtist", () => {
  const TestRenderer = () => {
    useLazyLoadQuery<MedianSalePriceAtAuctionQuery>(MedianSalePriceAtAuctionScreenQuery, {
      artistID: "artist-id",
      count: 10,
    })

    return <MedianSalePriceAtAuction artistID="artist-id" />
  }

  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  describe("when changing an artist from artists list", () => {
    it("should update the selected artist", async () => {
      renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      mockEnvironment.mock.resolveMostRecentOperation({ data: mockResult })

      // Check initial artist is selected
      await waitFor(() => expect(screen.getByText("Andy Warhol")).toBeTruthy())

      fireEvent.press(screen.getByTestId("change-artist-touchable"))

      // Modal is visible and the list is populated
      expect(screen.getByTestId("average-sale-price-select-artist-modal").props.visible).toBeTrue()
      expect(screen.getByTestId("select-artist-flatlist").props.data.length).toBe(3)

      // Press on Banksy
      fireEvent.press(screen.getByTestId("artist-section-item-Banksy"))

      // fetch Banksy data
      mockEnvironment.mock.resolveMostRecentOperation({
        data: { artist: { internalID: "artist-id", name: "Banksy", imageUrl: "image-url" } },
      })

      // Modal is hidden and the artist is updated
      await waitFor(() =>
        expect(
          screen.getByTestId("average-sale-price-select-artist-modal").props.visible
        ).toBeFalse()
      )
      expect(screen.getByTestId("average-sale-price-select-artist-modal").props.visible).toBeFalse()
      expect(screen.getByText("Banksy")).toBeTruthy()
    })
  })

  describe("when searching for an artist in artists list", () => {
    it("should update the list of artists if the artist name is in the list", async () => {
      renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      mockEnvironment.mock.resolveMostRecentOperation({ data: mockResult })

      await waitFor(() => expect(screen.getByTestId("change-artist-touchable")).toBeTruthy())
      fireEvent.press(screen.getByTestId("change-artist-touchable"))

      // Modal is visible and the section list is populated
      expect(screen.getByTestId("average-sale-price-select-artist-modal").props.visible).toBeTrue()
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
      mockEnvironment.mock.resolveMostRecentOperation({
        data: {
          artist: { internalID: "artist-id", name: "Amoako Boafo", imageUrl: "image-url" },
        },
      })
      await waitFor(() =>
        expect(
          screen.getByTestId("average-sale-price-select-artist-modal").props.visible
        ).toBeFalse()
      )

      // Modal is hidden and the artist is updated
      expect(screen.getByTestId("average-sale-price-select-artist-modal").props.visible).toBeFalse()
      expect(screen.getByText("Amoako Boafo")).toBeTruthy()
    })

    it("should display an error message if the artist name is not in the list", async () => {
      renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      mockEnvironment.mock.resolveMostRecentOperation({ data: mockResult })

      await waitFor(() => expect(screen.getByTestId("change-artist-touchable")).toBeTruthy())
      fireEvent.press(screen.getByTestId("change-artist-touchable"))

      // Modal is visible and the section list is populated
      expect(screen.getByTestId("average-sale-price-select-artist-modal").props.visible).toBeTrue()
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
      collectedArtistsConnection: {
        edges: [
          {
            node: {
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
  },
}

import { fireEvent } from "@testing-library/react-native"
import { MedianSalePriceAtAuctionQuery } from "__generated__/MedianSalePriceAtAuctionQuery.graphql"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { useLazyLoadQuery } from "react-relay"
import { act } from "react-test-renderer"
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

  const getWrapper = async () => {
    const tree = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    act(() => {
      mockEnvironment.mock.resolveMostRecentOperation({ data: mockResult })
    })

    await flushPromiseQueue()

    return tree
  }

  describe("when changing an artist from artists list", () => {
    it("should update the selected artist", async () => {
      const { getByTestId, getByText } = await getWrapper()

      // Check initial artist is selected
      expect(getByText("Andy Warhol")).toBeTruthy()

      fireEvent.press(getByTestId("change-artist-touchable"))

      // Modal is visible and the list is populated
      expect(getByTestId("select-artist-modal").props.visible).toBe(true)
      expect(getByTestId("select-artist-flatlist").props.data.length).toBe(3)

      // Press on Banksy
      fireEvent.press(getByTestId("artist-section-item-Banksy"))

      // fetch Banksy data
      act(() => {
        mockEnvironment.mock.resolveMostRecentOperation({
          data: { artist: { internalID: "artist-id", name: "Banksy", imageUrl: "image-url" } },
        })
      })
      await flushPromiseQueue()

      // Modal is hidden and the artist is updated
      expect(getByTestId("select-artist-modal").props.visible).toBe(false)
      expect(getByText("Banksy")).toBeTruthy()
    })
  })

  describe("when searching for an artist in artists list", () => {
    it("should update the list of artists if the artist name is in the list", async () => {
      const { getByTestId, getByText } = await getWrapper()

      fireEvent.press(getByTestId("change-artist-touchable"))

      // Modal is visible and the section list is populated
      expect(getByTestId("select-artist-modal").props.visible).toBe(true)
      expect(getByTestId("select-artist-flatlist").props.data.length).toBe(3)

      // Search for "Boafo"
      const searchInput = getByTestId("select-artists-search-input")

      fireEvent(searchInput, "focus")
      fireEvent(searchInput, "changeText", "Boafo")

      // Flatlist is showing
      expect(getByTestId("select-artist-flatlist")).toBeTruthy()
      expect(getByTestId("select-artist-flatlist").props.data.length).toBe(1)

      // Amoako Boafo is in the results list
      expect(getByTestId("artist-section-item-Amoako Boafo")).toBeTruthy()

      // Press on Amoako Boafo
      fireEvent.press(getByTestId("artist-section-item-Amoako Boafo"))

      // fetch Amoako Boafo data
      act(() => {
        mockEnvironment.mock.resolveMostRecentOperation({
          data: {
            artist: { internalID: "artist-id", name: "Amoako Boafo", imageUrl: "image-url" },
          },
        })
      })
      await flushPromiseQueue()

      // Modal is hidden and the artist is updated
      expect(getByTestId("select-artist-modal").props.visible).toBe(false)
      expect(getByText("Amoako Boafo")).toBeTruthy()
    })

    it("should display an error message if the artist name is not in the list", async () => {
      const { getByTestId, getByText } = await getWrapper()

      fireEvent.press(getByTestId("change-artist-touchable"))

      // Modal is visible and the section list is populated
      expect(getByTestId("select-artist-modal").props.visible).toBe(true)
      expect(getByTestId("select-artist-flatlist").props.data.length).toBe(3)

      // Search for "Artist doesn't exist"
      const searchInput = getByTestId("select-artists-search-input")

      fireEvent(searchInput, "focus")
      fireEvent(searchInput, "changeText", "Artist doesn't exist")

      // Flatlist is showing
      expect(getByTestId("select-artist-flatlist")).toBeTruthy()
      expect(getByTestId("select-artist-flatlist").props.data.length).toBe(0)

      // Error message is displayed
      expect(
        getByText(
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

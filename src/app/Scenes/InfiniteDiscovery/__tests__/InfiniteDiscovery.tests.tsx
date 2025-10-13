import { captureMessage } from "@sentry/react-native"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { swipeLeft } from "app/Components/FancySwiper/__tests__/utils"
import { InfiniteDiscoveryQueryRenderer } from "app/Scenes/InfiniteDiscovery/InfiniteDiscoveryQueryRenderer"
import { goBack } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { fetchQuery, useLazyLoadQuery } from "react-relay"
import { Observable } from "relay-runtime"

jest.mock("@sentry/react-native", () => ({
  ...jest.requireActual("@sentry/react-native"),
  captureMessage: jest.fn(),
  reactNavigationIntegration: jest.fn(() => ({})),
}))
jest.mock("app/system/navigation/navigate")
jest.mock("react-relay", () => ({
  ...jest.requireActual("react-relay"),
  fetchQuery: jest.fn(),
  useLazyLoadQuery: jest.fn(),
}))
jest.mock("app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheet", () => ({
  InfiniteDiscoveryBottomSheet: () => null,
}))

describe("InfiniteDiscovery", () => {
  const mockFetchQuery = fetchQuery as jest.MockedFunction<typeof fetchQuery>
  const mockUseLazyLoadQuery = useLazyLoadQuery as jest.MockedFunction<typeof useLazyLoadQuery>
  const mockCaptureMessage = captureMessage as jest.MockedFunction<typeof captureMessage>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe.skip("Navigation", () => {
    it("hides the back icon if the current artwork is on the first artwork", async () => {
      await renderAndFetchFirstBatch(mockFetchQuery)

      expect(screen.queryByTestId("back-icon")).not.toBeOnTheScreen()
    })

    it("shows the back icon if the current artwork is not the first artwork", async () => {
      await renderAndFetchFirstBatch(mockFetchQuery)

      swipeLeft()

      await screen.findByTestId("back-icon")
    })

    it("returns to the previous artwork when the back icon is pressed", async () => {
      await renderAndFetchFirstBatch(mockFetchQuery)

      expect(screen.queryByTestId("back-icon")).not.toBeOnTheScreen()
      swipeLeft()

      await screen.findByTestId("back-icon")

      fireEvent.press(screen.getByTestId("back-icon"))
      expect(screen.queryByTestId("back-icon")).not.toBeOnTheScreen()
    })

    it("navigates to home view when the close icon is pressed", async () => {
      await renderAndFetchFirstBatch(mockFetchQuery)

      fireEvent.press(screen.getByTestId("close-icon"))
      expect(goBack).toHaveBeenCalledTimes(1)
    })
  })

  describe.skip("Telemetry", () => {
    it("sends telemetry when initial artworks < 5", async () => {
      const artworks = [
        { internalID: "artwork-1" },
        { internalID: "artwork-2" },
        { internalID: "artwork-3" },
      ]

      mockUseLazyLoadQuery.mockReturnValue({
        discoverArtworks: { edges: artworks.map((art) => ({ node: art })) },
      })

      renderWithWrappers(<InfiniteDiscoveryQueryRenderer />)

      await waitFor(() => {
        expect(mockCaptureMessage).toHaveBeenCalledWith(
          "Discovery daily received 3 initial artworks (expected 5)",
          {
            level: "info",
            extra: {
              artworkCount: 3,
              artworkIds: ["artwork-1", "artwork-2", "artwork-3"],
            },
          }
        )
      })
    })

    it("does not send telemetry when initial artworks >= 5", async () => {
      const artworks = [
        { internalID: "artwork-1" },
        { internalID: "artwork-2" },
        { internalID: "artwork-3" },
        { internalID: "artwork-4" },
        { internalID: "artwork-5" },
      ]

      mockUseLazyLoadQuery.mockReturnValue({
        discoverArtworks: { edges: artworks.map((art) => ({ node: art })) },
      })

      renderWithWrappers(<InfiniteDiscoveryQueryRenderer />)

      await waitFor(() => {
        expect(mockCaptureMessage).not.toHaveBeenCalled()
      })
    })
  })
})

const renderAndFetchFirstBatch = async (mockFetchQuery: jest.MockedFunction<typeof fetchQuery>) => {
  mockFetchQuery.mockReturnValueOnce(
    Observable.from(
      Promise.resolve({
        discoverArtworks: {
          edges: [
            {
              node: {
                internalID: "artwork-1",
              },
            },
            {
              node: {
                internalID: "artwork-2",
              },
            },
          ],
        },
      })
    )
  )
  renderWithWrappers(<InfiniteDiscoveryQueryRenderer />)
  await screen.findByTestId("top-fancy-swiper-card")
}

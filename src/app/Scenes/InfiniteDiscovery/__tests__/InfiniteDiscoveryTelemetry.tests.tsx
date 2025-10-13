import { captureMessage } from "@sentry/react-native"
import { render, waitFor } from "@testing-library/react-native"
import { InfiniteDiscoveryQueryRenderer } from "app/Scenes/InfiniteDiscovery/InfiniteDiscoveryQueryRenderer"
import React from "react"
import { useLazyLoadQuery } from "react-relay"

jest.mock("@sentry/react-native", () => ({
  captureMessage: jest.fn(),
}))

jest.mock("react-relay", () => ({
  ...jest.requireActual("react-relay"),
  useLazyLoadQuery: jest.fn(),
}))

const mockCaptureMessage = captureMessage as jest.MockedFunction<typeof captureMessage>
const mockUseLazyLoadQuery = useLazyLoadQuery as jest.MockedFunction<typeof useLazyLoadQuery>

describe("InfiniteDiscovery Telemetry", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("sends telemetry when initial artworks < 5", async () => {
    const artworks = [
      { internalID: "artwork-1" },
      { internalID: "artwork-2" },
      { internalID: "artwork-3" },
    ]

    mockUseLazyLoadQuery.mockReturnValue({
      discoverArtworks: { edges: artworks.map((art) => ({ node: art })) },
    })

    render(<InfiniteDiscoveryQueryRenderer />)

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

    render(<InfiniteDiscoveryQueryRenderer />)

    await waitFor(() => {
      expect(mockCaptureMessage).not.toHaveBeenCalled()
    })
  })
})

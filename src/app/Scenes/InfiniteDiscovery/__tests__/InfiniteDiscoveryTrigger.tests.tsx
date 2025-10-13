import { render } from "@testing-library/react-native"
import { InfiniteDiscovery } from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import React from "react"

const mockArtwork = {
  internalID: "artwork-1",
  slug: "test-artwork",
  artists: [{ internalID: "artist-1" }],
}

describe("InfiniteDiscovery Dynamic Trigger", () => {
  const mockFetchMore = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("sets trigger index to 0 for 1 artwork", () => {
    const artworks = [mockArtwork]
    render(<InfiniteDiscovery fetchMoreArtworks={mockFetchMore} artworks={artworks} />)
    expect(mockFetchMore).not.toHaveBeenCalled()
  })

  it("sets trigger index to 0 for 2 artworks", () => {
    const artworks = [mockArtwork, { ...mockArtwork, internalID: "artwork-2" }]
    render(<InfiniteDiscovery fetchMoreArtworks={mockFetchMore} artworks={artworks} />)
    expect(mockFetchMore).not.toHaveBeenCalled()
  })

  it("sets trigger index to 1 for 3 artworks", () => {
    const artworks = [
      mockArtwork,
      { ...mockArtwork, internalID: "artwork-2" },
      { ...mockArtwork, internalID: "artwork-3" },
    ]
    render(<InfiniteDiscovery fetchMoreArtworks={mockFetchMore} artworks={artworks} />)
    expect(mockFetchMore).not.toHaveBeenCalled()
  })

  it("sets trigger index to 2 for 4+ artworks", () => {
    const artworks = [
      mockArtwork,
      { ...mockArtwork, internalID: "artwork-2" },
      { ...mockArtwork, internalID: "artwork-3" },
      { ...mockArtwork, internalID: "artwork-4" },
      { ...mockArtwork, internalID: "artwork-5" },
    ]
    render(<InfiniteDiscovery fetchMoreArtworks={mockFetchMore} artworks={artworks} />)
    expect(mockFetchMore).not.toHaveBeenCalled()
  })
})

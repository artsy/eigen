import { render } from "@testing-library/react-native"
import { Swiper } from "app/Scenes/InfiniteDiscovery/Components/Swiper/Swiper"
import { InfiniteDiscoveryArtwork } from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"

const mockArtwork: InfiniteDiscoveryArtwork = {
  internalID: "artwork-1",
  slug: "test-artwork",
  title: "Test Artwork",
  artists: [{ internalID: "artist-1" }],
  " $fragmentSpreads": {} as any,
}

describe("Swiper Last Card Navigation", () => {
  const mockOnSwipe = jest.fn()
  const mockOnRewind = jest.fn()
  const mockOnReachTriggerIndex = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("calls onReachTriggerIndex when swiping on last card", () => {
    const cards = [mockArtwork]

    render(
      <Swiper
        cards={cards}
        onSwipe={mockOnSwipe}
        onRewind={mockOnRewind}
        onReachTriggerIndex={mockOnReachTriggerIndex}
        triggerIndex={0}
      />
    )

    expect(mockOnReachTriggerIndex).not.toHaveBeenCalled()
  })

  it("does not call onReachTriggerIndex when no trigger handler provided", () => {
    const cards = [mockArtwork]

    render(<Swiper cards={cards} onSwipe={mockOnSwipe} onRewind={mockOnRewind} />)

    expect(mockOnReachTriggerIndex).not.toHaveBeenCalled()
  })

  it("handles multiple cards correctly", () => {
    const cards = [
      mockArtwork,
      { ...mockArtwork, internalID: "artwork-2" },
      { ...mockArtwork, internalID: "artwork-3" },
    ]

    render(
      <Swiper
        cards={cards}
        onSwipe={mockOnSwipe}
        onRewind={mockOnRewind}
        onReachTriggerIndex={mockOnReachTriggerIndex}
        triggerIndex={1}
      />
    )

    expect(cards).toHaveLength(3)
  })
})

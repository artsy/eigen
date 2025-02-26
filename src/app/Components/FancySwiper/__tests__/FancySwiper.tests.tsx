import { waitFor } from "@testing-library/react-native"
import { FancySwiper, FancySwiperArtworkCard } from "app/Components/FancySwiper/FancySwiper"
import { swipeLeft, swipeRight } from "app/Components/FancySwiper/__tests__/utils"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("FancySwiper", () => {
  it.skip("allows the user to swipe left", async () => {
    const mockOnSwipeLeft = jest.fn()
    renderWithWrappers(
      <FancySwiper
        cards={cards}
        onSwipeRight={jest.fn()}
        onSwipeLeft={mockOnSwipeLeft}
        topCardIndex={0}
      />
    )
    swipeLeft()
    await waitFor(() => expect(mockOnSwipeLeft).toHaveBeenCalledOnce())
  })

  it.skip("allows the user to swipe right", async () => {
    const mockOnSwipeRight = jest.fn()
    renderWithWrappers(
      <FancySwiper
        cards={cards}
        onSwipeRight={mockOnSwipeRight}
        onSwipeLeft={jest.fn()}
        topCardIndex={0}
      />
    )
    swipeRight()
    await waitFor(() => expect(mockOnSwipeRight).toHaveBeenCalledOnce())
  })
})

const cards: FancySwiperArtworkCard[] = [
  { content: <></>, artworkId: "artwork-id-1" },
  { content: <></>, artworkId: "artwork-id-2" },
]

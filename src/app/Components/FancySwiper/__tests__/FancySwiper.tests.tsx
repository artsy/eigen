import { waitFor } from "@testing-library/react-native"
import { FancySwiper } from "app/Components/FancySwiper/FancySwiper"
import { Card } from "app/Components/FancySwiper/FancySwiperCard"
import { swipeLeft, swipeRight } from "app/Components/FancySwiper/__tests__/utils"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("FancySwiper", () => {
  it("allows the user to swipe left", async () => {
    const mockOnSwipeLeft = jest.fn()
    renderWithWrappers(<FancySwiper cards={cards} onSwipeLeft={mockOnSwipeLeft} />)
    swipeLeft()
    await waitFor(() => expect(mockOnSwipeLeft).toHaveBeenCalledOnce())
  })

  it("allows the user to swipe right", async () => {
    const mockOnSwipeRight = jest.fn()
    renderWithWrappers(<FancySwiper cards={cards} onSwipeRight={mockOnSwipeRight} />)
    swipeRight()
    await waitFor(() => expect(mockOnSwipeRight).toHaveBeenCalledOnce())
  })
})

const cards: Card[] = [
  {
    id: "1",
    jsx: <>1</>,
  },
  {
    id: "2",
    jsx: <>2</>,
  },
]

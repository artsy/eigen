import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { FancySwiper } from "app/Components/FancySwiper/FancySwiper"
import { Card } from "app/Components/FancySwiper/FancySwiperCard"
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

const swipeLeft = () => {
  swipe(-100)
}

const swipeRight = () => {
  swipe(100)
}

const swipe = (moveX: number) => {
  const topCard = screen.getByTestId("top-fancy-swiper-card")

  const startX = 0
  const startY = 0
  const startTimeStamp = Date.now()
  const moveTimeStamp = Date.now()
  const releaseTimeStamp = Date.now()

  fireEvent(topCard, "responderStart", {
    touchHistory: {
      indexOfSingleActiveTouch: 1,
      mostRecentTimeStamp: startTimeStamp,
      numberActiveTouches: 1,
      touchBank: [
        undefined,
        {
          currentPageX: startX,
          currentPageY: startY,
          currentTimeStamp: startTimeStamp,
          previousPageX: startX,
          previousPageY: startY,
          previousTimeStamp: startTimeStamp,
          startPageX: startX,
          startPageY: startY,
          startTimeStamp: startTimeStamp,
          touchActive: true,
        },
      ],
    },
  })

  fireEvent(topCard, "responderMove", {
    touchHistory: {
      indexOfSingleActiveTouch: 1,
      mostRecentTimeStamp: moveTimeStamp,
      numberActiveTouches: 1,
      touchBank: [
        undefined,
        {
          currentPageX: moveX,
          currentPageY: startY,
          currentTimeStamp: moveTimeStamp,
          previousPageX: startX,
          previousPageY: startY,
          previousTimeStamp: startTimeStamp,
          startPageX: startX,
          startPageY: startY,
          startTimeStamp: startTimeStamp,
          touchActive: true,
        },
      ],
    },
  })

  fireEvent(topCard, "responderRelease", {
    touchHistory: {
      indexOfSingleActiveTouch: 1,
      mostRecentTimeStamp: releaseTimeStamp,
      numberActiveTouches: 0,
      touchBank: [
        undefined,
        {
          currentPageX: moveX,
          currentPageY: startY,
          currentTimeStamp: releaseTimeStamp,
          previousPageX: moveX,
          previousPageY: startY,
          previousTimeStamp: moveTimeStamp,
          startPageX: startX,
          startPageY: startY,
          startTimeStamp: startTimeStamp,
          touchActive: false,
        },
      ],
    },
  })
}

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

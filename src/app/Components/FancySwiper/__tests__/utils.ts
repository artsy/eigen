import { fireEvent, screen } from "@testing-library/react-native"

export const swipeLeft = async () => {
  await swipe(-100)
}

export const swipeRight = async () => {
  await swipe(100)
}

const swipe = async (moveX: number) => {
  const topCard = screen.getByTestId("top-fancy-swiper-card")

  const startX = 0
  const startY = 0
  const startTimeStamp = Date.now()
  const moveTimeStamp = Date.now()
  const releaseTimeStamp = Date.now()

  await fireEvent(topCard, "responderStart", {
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

  await fireEvent(topCard, "responderMove", {
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

  await fireEvent(topCard, "responderRelease", {
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

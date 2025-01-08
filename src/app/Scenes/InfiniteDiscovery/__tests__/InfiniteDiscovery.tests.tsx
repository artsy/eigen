import { fireEvent, screen } from "@testing-library/react-native"
import { Card } from "app/Components/FancySwiper/FancySwiperCard"
import {
  infiniteDiscoveryQuery,
  InfiniteDiscoveryWithSuspense,
} from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

/**
 * The swipe gesture is not a built-in event (like fireEvent.press or fireEvent.changeText), so this
 * test suite uses a fake implementation of the FancySwiper component to make assertions about the
 * InfiniteDiscovery component when a user has swiped left on the top card.
 *
 * In this fake implementation, the FancySwiper component renders a Button for each card. The first
 * card is assigned onSwipeLeft as its onPress handler, and the testID "top-card". In order to swipe
 * left, tests will get the top card by its testID and fire a press event on it.
 */

jest.mock("app/Components/FancySwiper/FancySwiper", () => {
  const { Button } = jest.requireActual("@artsy/palette-mobile")
  return {
    __esModule: true,
    FancySwiper: ({ cards, onSwipeLeft }: { cards: Card[]; onSwipeLeft: () => void }) => {
      return (
        <>
          {cards.map((_, i) => (
            <Button
              key={i}
              onPress={i === 0 ? onSwipeLeft : undefined}
              testID={i === 0 ? "top-card" : undefined}
            >
              Swipe Left
            </Button>
          ))}
        </>
      )
    },
  }
})

jest.mock("app/system/navigation/navigate")

describe("InfiniteDiscovery", () => {
  const mockNavigate = navigate as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("hides the back button if the current artwork is on the first artwork", () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: InfiniteDiscoveryWithSuspense,
      query: infiniteDiscoveryQuery,
    })

    renderWithRelay(marketingCollection)
    expect(screen.queryByText("Back")).not.toBeOnTheScreen()
  })

  it("shows the back button if the current artwork is not the first artwork", () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: InfiniteDiscoveryWithSuspense,
      query: infiniteDiscoveryQuery,
    })
    renderWithRelay(marketingCollection)
    fireEvent.press(screen.getByTestId("top-card"))
    expect(screen.getByText("Back")).toBeOnTheScreen()
  })

  it("returns to the previous artwork when the back button is pressed", () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: InfiniteDiscoveryWithSuspense,
      query: infiniteDiscoveryQuery,
    })

    renderWithRelay(marketingCollection)

    expect(screen.queryByText("Back")).not.toBeOnTheScreen()
    fireEvent.press(screen.getByTestId("top-card"))
    expect(screen.getByText("Back")).toBeOnTheScreen()
    fireEvent.press(screen.getByText("Back"))
    expect(screen.queryByText("Back")).not.toBeOnTheScreen()
  })

  it("navigates to home view when the exit button is pressed", () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: InfiniteDiscoveryWithSuspense,
      query: infiniteDiscoveryQuery,
    })
    renderWithRelay(marketingCollection)
    fireEvent.press(screen.getByText("Exit"))
    expect(mockNavigate).toHaveBeenCalledWith("/home-view")
  })
})

const marketingCollection = {
  MarketingCollection: () => ({
    artworksConnection: {
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
  }),
}

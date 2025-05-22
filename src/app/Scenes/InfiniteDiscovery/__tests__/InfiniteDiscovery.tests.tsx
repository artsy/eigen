import { fireEvent, screen } from "@testing-library/react-native"
import { swipeLeft } from "app/Components/FancySwiper/__tests__/utils"
import { InfiniteDiscoveryQueryRenderer } from "app/Scenes/InfiniteDiscovery/InfiniteDiscoveryQueryRenderer"
import { goBack } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { fetchQuery } from "react-relay"
import { Observable } from "relay-runtime"

jest.mock("app/system/navigation/navigate")
jest.mock("react-relay", () => ({
  ...jest.requireActual("react-relay"),
  fetchQuery: jest.fn(),
}))
jest.mock("app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheet", () => ({
  InfiniteDiscoveryBottomSheet: () => null,
}))

xdescribe("InfiniteDiscovery", () => {
  const mockFetchQuery = fetchQuery as jest.MockedFunction<typeof fetchQuery>

  beforeEach(() => {
    jest.clearAllMocks()
  })

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

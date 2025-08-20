import Geolocation from "@react-native-community/geolocation"
import { screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { ShowsForYouScreen } from "app/Scenes/Shows/ShowsForYou"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import mockFetch from "jest-fetch-mock"

jest.mock("@react-native-community/geolocation", () => ({
  setRNConfiguration: jest.fn(),
  getCurrentPosition: jest.fn((success, _) => {
    success({ coords: { latitude: 1, longitude: 2 } })
  }),
}))

describe("ShowsForYou", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const { renderWithRelay } = setupTestWrapper({
    Component: () => <ShowsForYouScreen />,
  })

  it("renders shows for you", async () => {
    renderWithRelay({
      Me: () => ({
        showsConnection: {
          edges: [
            {
              node: {
                name: "Sebastián Meltz-Collazo",
                partner: {
                  name: "Partner1",
                },
              },
            },
            {
              node: {
                name: "Artsy Editorial",
                partner: {
                  name: "Partner2",
                },
              },
            },
          ],
        },
      }),
    })

    await waitForElementToBeRemoved(
      () => screen.queryByTestId("shows-for-you-screen-placeholder"),
      { timeout: 10000 }
    )

    expect(Geolocation.getCurrentPosition).toHaveBeenCalled()
    expect(mockFetch).not.toHaveBeenCalled()

    expect(screen.getByText("Sebastián Meltz-Collazo")).toBeOnTheScreen()
    expect(screen.getByText("Artsy Editorial")).toBeOnTheScreen()

    expect(screen.getByText("Partner1")).toBeOnTheScreen()
    expect(screen.getByText("Partner2")).toBeOnTheScreen()
  })
})

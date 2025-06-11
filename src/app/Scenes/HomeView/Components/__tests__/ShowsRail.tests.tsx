import Geolocation from "@react-native-community/geolocation"
import { fireEvent, screen } from "@testing-library/react-native"
import { ShowsRailContainer } from "app/Scenes/HomeView/Components/ShowsRail"
import { navigate } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import mockFetch from "jest-fetch-mock"
import "react-native"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

jest.mock("@react-native-community/geolocation", () => ({
  setRNConfiguration: jest.fn(),
  getCurrentPosition: jest.fn((success, _) => {
    success({ coords: { latitude: 1, longitude: 2 } })
  }),
}))

describe("ShowsRailContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("with location enabled", () => {
    const environment = createMockEnvironment()

    it("renders the title and the shows and handles title press", async () => {
      renderWithHookWrappersTL(<ShowsRailContainer title="Shows for You" />, environment)

      environment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, { Me: () => meResponse })
      )

      expect(Geolocation.getCurrentPosition).toHaveBeenCalled()
      expect(mockFetch).not.toHaveBeenCalled()

      await flushPromiseQueue()

      expect(screen.getByText("Shows for You")).toBeDefined()

      expect(screen.getByText("Leeum Collection: Beyond Space")).toBeDefined()

      fireEvent.press(screen.getByText("Shows for You"))

      expect(navigate).toHaveBeenCalledWith("/shows-for-you")
      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: "tappedShowGroup",
        context_module: "showsRail",
        context_screen_owner_type: "home",
        destination_screen_owner_type: "show",
        type: "header",
      })
    })
  })
})

const meResponse = {
  showsConnection: {
    totalCount: 20,
    edges: [
      {
        node: {
          name: "Leeum Collection: Beyond Space",
          id: "U2hvdzo1OGE1M2YzYzc2MjJkZDQxNmY3YTNjNGQ=",
          metaImage: {
            url: "https://d32dm0rphc51dk.cloudfront.net/vWq6mRB9uyvfhA1JT1xH_A/larger.jpg",
          },
          internalID: "58a53f3c7622dd416f7a3c4d",
          slug: "leeum-samsung-museum-of-art-leeum-collection-beyond-space",
          href: "/show/leeum-samsung-museum-of-art-leeum-collection-beyond-space",
          status: "running",
          startAt: "2014-08-19T12:00:00+00:00",
          endAt: "2999-12-31T12:00:00+00:00",
          artists: null,
          partner: {
            name: "Leeum, Samsung Museum of Art",
          },
        },
      },
    ],
  },
}

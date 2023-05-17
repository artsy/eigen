import Geolocation from "@react-native-community/geolocation"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import "react-native"
import { NetworkInfo } from "react-native-network-info"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ShowsRailContainer } from "./ShowsRail"

jest.mock("@react-native-community/geolocation", () => ({
  setRNConfiguration: jest.fn(),
  getCurrentPosition: jest.fn((success, _) => {
    success({ coords: { latitude: 1, longitude: 2 } })
  }),
}))

jest.mock("react-native-network-info", () => ({
  NetworkInfo: {
    getIPV4Address: jest.fn(async () => "my-ip"),
  },
}))

describe("ShowsRailContainer", () => {
  const environment = createMockEnvironment()

  it("renders the title and the shows", async () => {
    const { getByText } = renderWithHookWrappersTL(
      <ShowsRailContainer title="Shows for You" />,
      environment
    )

    environment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, { Me: () => meResponse })
    )

    expect(Geolocation.getCurrentPosition).toHaveBeenCalled()
    expect(NetworkInfo.getIPV4Address).not.toHaveBeenCalled()

    await flushPromiseQueue()

    expect(getByText("Shows for You")).toBeDefined()

    expect(getByText("Leeum Collection: Beyond Space")).toBeDefined()
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

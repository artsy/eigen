import { CityFixture } from "lib/__fixtures__/CityFixture"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import { graphql } from "react-relay"
import { GlobalMapContainer } from "../GlobalMap"

jest.unmock("react-relay")
jest.mock("@mapbox/react-native-mapbox-gl", () => ({
  StyleSheet: {
    create: jest.fn(),
    identity: jest.fn(),
    source: jest.fn(),
  },
  InterpolationMode: {
    Exponential: jest.fn(),
  },
  MapView: jest.fn(),
  setAccessToken: jest.fn(),
  UserTrackingModes: jest.fn(),
}))

describe("GlobalMap", () => {
  it("renders correctly", async () => {
    await renderRelayTree({
      Component: GlobalMapContainer,
      query: graphql`
        query GlobalMapTestsQuery($citySlug: String!, $maxInt: Int!) {
          viewer {
            ...GlobalMap_viewer @arguments(citySlug: $citySlug, maxInt: $maxInt)
          }
        }
      `,
      mockData: {
        safeAreaInsets: {
          top: 1,
        },
        viewer: {
          city: CityFixture,
        },
      },
      variables: {
        citySlug: "new-york-ny-usa",
        maxInt: 42,
      },
    })
  })
})

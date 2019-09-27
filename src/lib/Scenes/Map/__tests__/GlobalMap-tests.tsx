import { GlobalMapTestsQueryRawResponse } from "__generated__/GlobalMapTestsQuery.graphql"
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
  MapView: () => null,
  setAccessToken: jest.fn(),
  UserTrackingModes: jest.fn(),
}))

// FIXME: This test doesn’t actually make any assertions.
xdescribe("GlobalMap", () => {
  it("renders correctly", async () => {
    await renderRelayTree({
      componentProps: {
        safeAreaInsets: {
          top: 1,
        },
      },
      Component: GlobalMapContainer,
      query: graphql`
        query GlobalMapTestsQuery($citySlug: String!, $maxInt: Int!) @raw_response_type {
          ...GlobalMap_viewer @arguments(citySlug: $citySlug, maxInt: $maxInt)
        }
      `,
      mockData: {
        viewer: {
          city: CityFixture,
        },
      } as GlobalMapTestsQueryRawResponse,
      variables: {
        citySlug: "new-york-ny-usa",
        maxInt: 42,
      },
    })
  })
})

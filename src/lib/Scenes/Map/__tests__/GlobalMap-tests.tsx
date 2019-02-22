import { CityFixture } from "lib/__fixtures__/CityFixture"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import { graphql } from "react-relay"
import { GlobalMap } from "../GlobalMap"

jest.unmock("react-relay")
jest.mock("@mapbox/react-native-mapbox-gl", () => ({
  StyleSheet: {
    create: jest.fn(),
  },
  InterpolationMode: {
    Exponential: jest.fn(),
  },
  MapView: jest.fn(),
  setAccessToken: jest.fn(),
}))

describe("GlobalMap", () => {
  it("renders correctly", async () => {
    const wrapper = await renderRelayTree({
      Component: GlobalMap,
      query: graphql`
        query GlobalMapTestsQuery($citySlug: String!, $maxInt: Int!) {
          viewer {
            ...GlobalMap_viewer @arguments(citySlug: $citySlug, maxInt: $maxInt)
          }
        }
      `,
      mockData: {
        viewer: {
          city: CityFixture,
        },
      },
      variables: {
        citySlug: "new-york-ny-usa",
        maxInt: 42,
      },
    })

    // console.log(wrapper.html())
  })
})

import { fireEvent, screen, within } from "@testing-library/react-native"
import { CityGuideMapTestsQuery } from "__generated__/CityGuideMapTestsQuery.graphql"
import { CityData } from "app/Scenes/CityGuide/Components/CityGuideCityPicker"
import { CityGuideMap } from "app/Scenes/CityGuide/Components/CityGuideMap"
import { MAX_GRAPHQL_INT } from "app/Scenes/CityGuide/utils/maxGraphQLInt"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import React from "react"
import { graphql } from "react-relay"

jest.mock("app/utils/hooks/useFeatureFlag", () => ({
  useFeatureFlag: () => true,
}))

const mockSetCamera = jest.fn()

// The global @rnmapbox/maps mock (src/setupJest.tsx) doesn't stub UserTrackingModes, which
// CityGuideMap reads to build its map props.
jest.mock("@rnmapbox/maps", () => ({
  MapView: ({ children }: any) => children,
  Camera: require("react").forwardRef((_props: any, ref: any) => {
    require("react").useImperativeHandle(ref, () => ({ setCamera: mockSetCamera }))
    return null
  }),
  UserLocation: () => null,
  StyleURL: { Light: null },
  setAccessToken: () => jest.fn(),
  StyleSheet: {},
  ShapeSource: () => null,
  SymbolLayer: () => null,
  CircleLayer: () => null,
  UserTrackingModes: { Follow: "follow" },
}))

const cities: CityData[] = [
  { slug: "new-york-ny-usa", name: "New York", coordinates: { lat: 40.7128, lng: -74.006 } },
  { slug: "london-united-kingdom", name: "London", coordinates: { lat: 51.5072, lng: -0.1276 } },
]

const TestRenderer: React.FC<CityGuideMapTestsQuery["response"]> = ({ viewer }) => {
  if (!viewer) {
    return null
  }
  return <CityGuideMap citySlug="new-york-ny-usa" cities={cities} viewer={viewer} />
}

describe("CityGuideMap", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: TestRenderer,
    query: graphql`
      query CityGuideMapTestsQuery($citySlug: String!, $maxInt: Int!) @relay_test_operation {
        viewer {
          ...CityGuideMap_viewer @arguments(citySlug: $citySlug, maxInt: $maxInt)
        }
      }
    `,
    variables: { citySlug: "new-york-ny-usa", maxInt: MAX_GRAPHQL_INT },
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // At least one museum show is needed so the "Museums" pill renders at all (empty tabs are
  // hidden by CityFilterPills).
  const cityResolvers = {
    City: () => ({
      name: "New York",
      slug: "new-york-ny-usa",
      coordinates: { lat: 40.7128, lng: -74.006 },
    }),
    ShowConnection: () => ({
      edges: [
        {
          node: {
            isFollowed: false,
            startAt: "2026-01-01T00:00:00+00:00",
            endAt: "2026-02-01T00:00:00+00:00",
            partner: { type: "Institution" },
          },
        },
      ],
    }),
    FairConnection: () => ({ edges: [] }),
  }

  it("tracks a filter pill tap the same way CityGuideTabs tracks a tab tap", () => {
    renderWithRelay(cityResolvers)

    fireEvent.press(screen.getByTestId("city-filter-pill-museums"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action_name: "museumsTab",
        action_type: "tap",
        context_module: "MapFilterPills",
      })
    )
  })

  it("does not track a tap event before a pill is pressed", () => {
    renderWithRelay(cityResolvers)

    expect(mockTrackEvent).not.toHaveBeenCalledWith(expect.objectContaining({ action_type: "tap" }))
  })

  it("flies to a picked city and shows its name before its data loads", () => {
    __globalStoreTestUtils__?.injectState({
      userPrefs: { previouslySelectedCitySlug: "new-york-ny-usa" },
    })
    const { mockResolveLastOperation } = renderWithRelay(cityResolvers)

    fireEvent.press(screen.getByTestId("city-guide-city-switcher"))
    fireEvent.press(screen.getByText("London"))

    expect(mockSetCamera).toHaveBeenCalledWith(
      expect.objectContaining({ centerCoordinate: [-0.1276, 51.5072], animationMode: "flyTo" })
    )
    expect(
      within(screen.getByTestId("city-guide-city-switcher")).getByText("London")
    ).toBeOnTheScreen()
    expect(
      __globalStoreTestUtils__?.getCurrentState().userPrefs.previouslySelectedCitySlug
    ).toEqual("new-york-ny-usa")

    mockResolveLastOperation({
      City: () => ({ ...cityResolvers.City(), name: "London", slug: "london-united-kingdom" }),
    })

    expect(
      __globalStoreTestUtils__?.getCurrentState().userPrefs.previouslySelectedCitySlug
    ).toEqual("london-united-kingdom")
  })
})

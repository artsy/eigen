import { fireEvent, screen, within } from "@testing-library/react-native"
import { CityGuideMapTestsQuery } from "__generated__/CityGuideMapTestsQuery.graphql"
import { COLLAPSED_SHEET_HEIGHT } from "app/Scenes/CityGuide/Components/CityGuideBottomSheet"
import { CityGuideMap } from "app/Scenes/CityGuide/Components/CityGuideMap"
import { PREVIEW_BOTTOM_OFFSET } from "app/Scenes/CityGuide/utils/constants"
import { MAX_GRAPHQL_INT } from "app/Scenes/CityGuide/utils/maxGraphQLInt"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import React from "react"
import { graphql } from "react-relay"

let mockItinerariesEnabled = true
jest.mock("app/utils/hooks/useFeatureFlag", () => ({
  useFeatureFlag: () => mockItinerariesEnabled,
}))

// The global @rnmapbox/maps mock (src/setupJest.tsx) doesn't stub UserTrackingModes, which
// CityGuideMap reads to build its map props.
jest.mock("@rnmapbox/maps", () => ({
  // Renders its children and reports itself loaded, so the pins (and a pin tap) can mount.
  MapView: ({ children, onDidFinishLoadingMap }: any) => {
    const { useEffect } = jest.requireActual("react")
    useEffect(() => onDidFinishLoadingMap?.(), [onDidFinishLoadingMap])
    return children
  },
  Camera: () => null,
  UserLocation: () => null,
  StyleURL: { Light: null },
  setAccessToken: () => jest.fn(),
  StyleSheet: {},
  ShapeSource: () => null,
  SymbolLayer: () => null,
  CircleLayer: () => null,
  UserTrackingModes: { Follow: "follow" },
}))

// Stands in for a tap on the first pin of the "all" filter.
jest.mock("app/Scenes/CityGuide/Components/CityGuideMapPins", () => ({
  CityGuideMapPins: ({ featureCollections, onPress }: any) => {
    const { Text } = jest.requireActual("react-native")
    const feature = featureCollections.all?.featureCollection.features[0]
    return <Text onPress={() => onPress({ features: [feature] })}>tap pin</Text>
  },
}))

const TestRenderer: React.FC<CityGuideMapTestsQuery["response"]> = ({ viewer }) => {
  if (!viewer) {
    return null
  }
  return <CityGuideMap citySlug="new-york-ny-usa" viewer={viewer} />
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
    mockItinerariesEnabled = true
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
            slug: "frida-kahlo",
            name: "Frida Kahlo",
            location: { coordinates: { lat: 40.72, lng: -74.0 } },
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

  describe("pin card", () => {
    it("offers add-to-itinerary above the map's logo when itineraries are enabled", async () => {
      renderWithRelay(cityResolvers)

      fireEvent.press(screen.getByText("tap pin"))

      const card = await screen.findByTestId("city-guide-map-preview")
      expect(within(card).getByText("Frida Kahlo")).toBeOnTheScreen()
      expect(within(card).getByLabelText("Add Frida Kahlo to an itinerary")).toBeOnTheScreen()
      expect(card).toHaveStyle({ bottom: PREVIEW_BOTTOM_OFFSET })
    })

    it("shows the card without add-to-itinerary, above the collapsed sheet, when disabled", async () => {
      mockItinerariesEnabled = false
      renderWithRelay(cityResolvers)

      fireEvent.press(screen.getByText("tap pin"))

      const card = await screen.findByTestId("city-guide-map-preview")
      expect(within(card).getByText("Frida Kahlo")).toBeOnTheScreen()
      expect(screen.queryByLabelText("Add Frida Kahlo to an itinerary")).not.toBeOnTheScreen()
      // The mocked safe area has no bottom inset.
      expect(card).toHaveStyle({ bottom: COLLAPSED_SHEET_HEIGHT })
    })
  })
})

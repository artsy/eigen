import { act, fireEvent, screen, within } from "@testing-library/react-native"
import { CityGuideMapTestsQuery } from "__generated__/CityGuideMapTestsQuery.graphql"
import { COLLAPSED_SHEET_HEIGHT } from "app/Scenes/CityGuide/Components/CityGuideBottomSheet"
import { CityData } from "app/Scenes/CityGuide/Components/CityGuideCityPicker"
import { CityGuideMap } from "app/Scenes/CityGuide/Components/CityGuideMap"
import { PREVIEW_BOTTOM_OFFSET } from "app/Scenes/CityGuide/utils/constants"
import { MAX_GRAPHQL_INT } from "app/Scenes/CityGuide/utils/maxGraphQLInt"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import React from "react"
import { graphql } from "react-relay"

let mockItinerariesEnabled = true
jest.mock("app/utils/hooks/useFeatureFlag", () => ({
  useFeatureFlag: () => mockItinerariesEnabled,
}))

const mockSetCamera = jest.fn()

// The global @rnmapbox/maps mock (src/setupJest.tsx) doesn't stub UserTrackingModes, which
// CityGuideMap reads to build its map props.
jest.mock("@rnmapbox/maps", () => ({
  // Renders its children and reports itself loaded, so the pins (and a pin tap) can mount.
  MapView: ({ children, onDidFinishLoadingMap }: any) => {
    const { useEffect } = jest.requireActual("react")
    useEffect(() => onDidFinishLoadingMap?.(), [onDidFinishLoadingMap])
    return children
  },
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
// Stands in for a tap on the first pin of the "all" filter.
jest.mock("app/Scenes/CityGuide/Components/CityGuideMapPins", () => ({
  CityGuideMapPins: ({ featureCollections, onPress, shapeSourceRef }: any) => {
    const { Text } = jest.requireActual("react-native")
    const { useEffect, useMemo } = jest.requireActual("react")
    const features = useMemo(
      () => featureCollections.all?.featureCollection.features ?? [],
      [featureCollections]
    )
    useEffect(() => {
      shapeSourceRef.current = { getClusterLeaves: async () => ({ features }) }
    }, [features, shapeSourceRef])
    return (
      <>
        <Text onPress={() => onPress({ features: [features[0]] })}>tap pin</Text>
        <Text
          onPress={() =>
            onPress({
              features: [
                {
                  ...features[0],
                  properties: { cluster: true, point_count: features.length },
                },
              ],
            })
          }
        >
          tap cluster
        </Text>
      </>
    )
  },
}))

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
            id: "show-ny",
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

  describe("pin card", () => {
    it("offers add-to-itinerary above the map's logo when itineraries are enabled", async () => {
      renderWithRelay(cityResolvers)

      fireEvent.press(screen.getByText("tap pin"))

      const card = await screen.findByTestId("city-guide-map-preview")
      expect(within(card).getByText("Frida Kahlo")).toBeOnTheScreen()
      expect(within(card).getByLabelText("Add Frida Kahlo to an itinerary")).toBeOnTheScreen()
      expect(card).toHaveStyle({ bottom: PREVIEW_BOTTOM_OFFSET })
    })

    it("updates a selected card when Relay updates its itinerary membership", async () => {
      const { env } = renderWithRelay(cityResolvers)
      fireEvent.press(screen.getByText("tap pin"))
      await screen.findByLabelText("Add Frida Kahlo to an itinerary")

      act(() =>
        env.commitUpdate((store) => {
          store.get("show-ny")?.setValue(true, "isOnMyItineraries")
        })
      )

      expect(await screen.findByLabelText("Frida Kahlo is on an itinerary")).toBeOnTheScreen()
    })

    it("shows fair pins with the same StopCard layout", async () => {
      renderWithRelay({
        ...cityResolvers,
        ShowConnection: () => ({ edges: [] }),
        FairConnection: () => ({
          edges: [
            {
              node: {
                id: "fair-ny",
                slug: "frieze-new-york",
                name: "Frieze New York",
                location: {
                  name: "The Shed",
                  address: "545 W 30th St",
                  coordinates: { lat: 40.75, lng: -74.0 },
                },
              },
            },
          ],
        }),
      })
      fireEvent.press(screen.getByText("tap pin"))

      const card = await screen.findByTestId("city-guide-map-preview")
      expect(within(card).getByTestId("stop-card")).toBeOnTheScreen()
      expect(within(card).getByText("The Shed")).toBeOnTheScreen()
      expect(within(card).getByLabelText("Add Frieze New York to an itinerary")).toBeOnTheScreen()
    })

    it("shows every cluster place as a StopCard", async () => {
      renderWithRelay({
        ...cityResolvers,
        FairConnection: () => ({
          edges: [
            {
              node: {
                id: "fair-ny",
                slug: "frieze-new-york",
                name: "Frieze New York",
                location: { address: "545 W 30th St", coordinates: { lat: 40.75, lng: -74.0 } },
              },
            },
          ],
        }),
      })
      fireEvent.press(screen.getByText("tap cluster"))

      const card = await screen.findByTestId("city-guide-map-preview")
      expect(within(card).getAllByTestId("stop-card")).toHaveLength(2)
      expect(within(card).getByText("Frida Kahlo")).toBeOnTheScreen()
      expect(within(card).getByText("Frieze New York")).toBeOnTheScreen()
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

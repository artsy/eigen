import { OwnerType } from "@artsy/cohesion"
import { ScreenDimensionsProvider, Theme } from "@artsy/palette-mobile"
import { fireEvent, render, screen } from "@testing-library/react-native"
import { MapView } from "app/Scenes/CityGuide/Components/Map/MapView"
import { MapSection } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
import { BOUNDS_PADDING } from "app/Scenes/CityGuide/utils/constants"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"

let capturedCameraProps: any = null

// Overrides the global @rnmapbox/maps mock (src/setupJest.tsx) so `Camera` captures the props
// MapView passes it, letting the test inspect the computed bounds/padding.
jest.mock("@rnmapbox/maps", () => ({
  MapView: ({ children }: any) => children,
  Camera: (props: any) => {
    capturedCameraProps = props
    return null
  },
  setAccessToken: () => jest.fn(),
  StyleURL: { Light: null },
  StyleSheet: {},
  ShapeSource: ({ children }: any) => children ?? null,
  SymbolLayer: () => null,
  CircleLayer: () => null,
  LineLayer: () => null,
}))

// Renders MapPins as a host view so the test can read the pinned features and fire its
// `onSelectPlace` callback.
jest.mock("app/Scenes/CityGuide/Components/Map/MapPins", () => ({
  MapPins: (props: any) => {
    const { View } = require("react-native")
    return (
      <View testID="map-pins" collection={props.collection} onSelectPlace={props.onSelectPlace} />
    )
  },
}))

const TOP_INSET = 59

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: TOP_INSET, bottom: 0, left: 0, right: 0 }),
}))

// MapView renders plain props, not Relay fragments, so it doesn't need the full app
// Providers tree — just enough to satisfy its own imports (palette, navigation's `navigate`
// mock from setupJest.tsx).
const sections = (): MapSection[] => [
  {
    id: "section-1",
    title: "Day 1",
    places: [
      {
        id: "place-1",
        title: "Frieze London",
        coordinates: { lat: 51.5, lng: -0.1 },
      },
      {
        id: "place-2",
        title: "Tate Modern",
        coordinates: { lat: 51.55, lng: -0.05 },
      },
    ],
  },
]

describe("MapView cameraStop bounds padding", () => {
  beforeEach(() => {
    capturedCameraProps = null
  })

  it("pads the fitted bounds on all sides with BOUNDS_PADDING, plus the safe-area inset on top", async () => {
    await render(
      <Theme>
        <ScreenDimensionsProvider>
          <MapView
            sections={sections()}
            citySlug="london-united-kingdom"
            contextScreenOwnerType={OwnerType.cityGuideGuide}
            selectedPlaceId={null}
            onSelectPlace={() => {}}
          />
        </ScreenDimensionsProvider>
      </Theme>
    )

    const bounds = capturedCameraProps?.defaultSettings?.bounds

    expect(bounds).toBeDefined()
    expect(bounds.paddingBottom).toEqual(BOUNDS_PADDING)
    expect(bounds.paddingLeft).toEqual(BOUNDS_PADDING)
    expect(bounds.paddingRight).toEqual(BOUNDS_PADDING)
    // No pills row is shown for a single section, so paddingTop is the shared padding plus
    // the safe-area inset only — this is the notch/Dynamic Island clearance from FIREWORKS-54.
    expect(bounds.paddingTop).toEqual(BOUNDS_PADDING + TOP_INSET)
  })
})

describe("MapView Saved filter", () => {
  const savedSections = (): MapSection[] => [
    {
      id: "section-1",
      title: "Day 1",
      places: [
        { id: "saved", title: "Saved", coordinates: { lat: 51.5, lng: -0.1 }, isSaved: true },
        { id: "unsaved", title: "Unsaved", coordinates: { lat: 51.55, lng: -0.05 } },
      ],
    },
  ]

  const renderMap = async (props: { sections?: MapSection[]; showSavedFilter?: boolean } = {}) =>
    await render(
      <Theme>
        <ScreenDimensionsProvider>
          <MapView
            sections={props.sections ?? savedSections()}
            citySlug="london-united-kingdom"
            contextScreenOwnerType={OwnerType.cityGuideGuide}
            selectedPlaceId={null}
            onSelectPlace={() => {}}
            showSavedFilter={props.showSavedFilter}
          />
        </ScreenDimensionsProvider>
      </Theme>
    )

  const pinnedPlaceIds = () =>
    screen
      .getByTestId("map-pins")
      .props.collection.features.map((feature: any) => feature.properties.id)

  it("shows All and Saved pills even for a single section", async () => {
    await renderMap({ showSavedFilter: true })

    expect(screen.getByText("All")).toBeOnTheScreen()
    expect(screen.getByText("Saved")).toBeOnTheScreen()
  })

  it("filters the pins to saved places", async () => {
    await renderMap({ showSavedFilter: true })

    await fireEvent.press(screen.getByText("Saved"))

    expect(pinnedPlaceIds()).toEqual(["saved"])
  })

  it("has no Saved pill without the filter", async () => {
    await renderMap()

    expect(screen.queryByText("Saved")).not.toBeOnTheScreen()
    expect(screen.queryByText("All")).not.toBeOnTheScreen()
  })

  it("has no Saved pill when nothing is saved", async () => {
    const sections = savedSections()
    sections[0].places = sections[0].places.map((place) => ({ ...place, isSaved: false }))

    await renderMap({ sections, showSavedFilter: true })

    expect(screen.queryByText("Saved")).not.toBeOnTheScreen()
  })
})

describe("MapView tracking", () => {
  const twoSections = (): MapSection[] => [
    ...sections(),
    {
      id: "section-2",
      title: "Day 2",
      places: [{ id: "place-3", title: "Serpentine", coordinates: { lat: 51.5, lng: -0.17 } }],
    },
  ]

  const renderMap = async () =>
    await render(
      <Theme>
        <ScreenDimensionsProvider>
          <MapView
            sections={twoSections()}
            citySlug="london-united-kingdom"
            contextScreenOwnerType={OwnerType.cityGuideGuide}
            contextScreenOwnerId="guide-1"
            contextScreenOwnerSlug="chill-vibes-only"
            selectedPlaceId={null}
            onSelectPlace={() => {}}
          />
        </ScreenDimensionsProvider>
      </Theme>
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("tracks a single pin tap against the screen showing the map", async () => {
    await renderMap()

    await fireEvent(screen.getByTestId("map-pins"), "selectPlace", "place-1")

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedMapPin",
      context_screen_owner_type: "cityGuideGuide",
      context_screen_owner_id: "guide-1",
      context_screen_owner_slug: "chill-vibes-only",
      is_cluster: false,
    })
  })

  it("tracks a filter pill tap with the section it picks", async () => {
    await renderMap()

    await fireEvent.press(screen.getByText("Day 2"))

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedNavigationTab",
      context_module: "cityGuideMapFilter",
      context_screen_owner_type: "cityGuideGuide",
      context_screen_owner_id: "guide-1",
      context_screen_owner_slug: "chill-vibes-only",
      subject: "Day 2",
    })
  })
})

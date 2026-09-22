import { fireEvent, screen } from "@testing-library/react-native"
import { CityGuideMapTestsQuery } from "__generated__/CityGuideMapTestsQuery.graphql"
import { CityGuideMap } from "app/Scenes/CityGuide/Components/CityGuideMap"
import { MAX_GRAPHQL_INT } from "app/Scenes/CityGuide/utils/maxGraphQLInt"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import React from "react"
import { graphql } from "react-relay"

jest.mock("app/utils/hooks/useFeatureFlag", () => ({
  useFeatureFlag: () => true,
}))

// The global @rnmapbox/maps mock (src/setupJest.tsx) doesn't stub UserTrackingModes, which
// CityGuideMap reads to build its map props.
jest.mock("@rnmapbox/maps", () => ({
  MapView: () => null,
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
})

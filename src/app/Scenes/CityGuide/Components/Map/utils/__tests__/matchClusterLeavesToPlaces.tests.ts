import { MapPlace } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
import { matchClusterLeavesToPlaces } from "app/Scenes/CityGuide/Components/Map/utils/matchClusterLeavesToPlaces"

const PLACES: MapPlace[] = [
  { id: "stop-1", title: "Coffee at London Cafe", coordinates: { lat: 51.5, lng: -0.1 } },
  { id: "stop-2", title: "Gallery Visit", coordinates: { lat: 51.51, lng: -0.11 } },
  { id: "stop-3", title: "Frieze London", coordinates: { lat: 51.52, lng: -0.12 } },
]

const leafFor = (id: string) => ({ type: "Feature", properties: { id } })

describe("matchClusterLeavesToPlaces", () => {
  it("maps leaves back to the places they belong to, in leaf order", () => {
    const leaves = [leafFor("stop-3"), leafFor("stop-1")]

    const matched = matchClusterLeavesToPlaces(leaves, PLACES)

    expect(matched).toEqual([PLACES[2], PLACES[0]])
  })

  it("skips a leaf whose id has no matching place", () => {
    const leaves = [leafFor("stop-1"), leafFor("unknown-id"), leafFor("stop-2")]

    const matched = matchClusterLeavesToPlaces(leaves, PLACES)

    expect(matched).toEqual([PLACES[0], PLACES[1]])
  })

  it("skips a leaf with no id property at all", () => {
    const leaves = [leafFor("stop-1"), { type: "Feature", properties: {} }, { type: "Feature" }]

    const matched = matchClusterLeavesToPlaces(leaves, PLACES)

    expect(matched).toEqual([PLACES[0]])
  })

  it("returns an empty list for an empty leaf list", () => {
    expect(matchClusterLeavesToPlaces([], PLACES)).toEqual([])
  })

  it("returns an empty list when there are no places to match against", () => {
    const leaves = [leafFor("stop-1")]

    expect(matchClusterLeavesToPlaces(leaves, [])).toEqual([])
  })

  it("does not dedupe a place referenced by more than one leaf", () => {
    const leaves = [leafFor("stop-1"), leafFor("stop-1")]

    const matched = matchClusterLeavesToPlaces(leaves, PLACES)

    expect(matched).toEqual([PLACES[0], PLACES[0]])
  })
})

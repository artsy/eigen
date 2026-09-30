import {
  CLUSTER_COUNT_STYLE,
  getClusterCircleStyle,
  getStopSymbolStyle,
  PIN_COLOR,
  SELECTED_COLOR,
} from "app/Scenes/CityGuide/utils/constants"

describe("CLUSTER_COUNT_STYLE", () => {
  it("shows the plain cluster count", () => {
    expect(CLUSTER_COUNT_STYLE.textField).toEqual(["to-string", ["get", "point_count"]])
  })
})

describe(getStopSymbolStyle, () => {
  it("uses the plain icon when no place is selected", () => {
    expect(getStopSymbolStyle(null).iconImage).toEqual(["get", "icon"])
  })

  it("names the selected place's icon with a -selected suffix", () => {
    expect(getStopSymbolStyle("place-1").iconImage).toEqual([
      "case",
      ["==", ["get", "id"], "place-1"],
      ["concat", ["get", "icon"], "-selected"],
      ["get", "icon"],
    ])
  })

  it("never lets Mapbox drop colliding pins", () => {
    const style = getStopSymbolStyle(null)

    expect(style.iconAllowOverlap).toBe(true)
    expect(style.iconIgnorePlacement).toBe(true)
  })
})

describe(getClusterCircleStyle, () => {
  it("colours every cluster black when none is active", () => {
    expect(getClusterCircleStyle(null).circleColor).toBe(PIN_COLOR)
  })

  it("recolours only the active cluster purple", () => {
    expect(getClusterCircleStyle(7).circleColor).toEqual([
      "case",
      ["==", ["get", "cluster_id"], 7],
      SELECTED_COLOR,
      PIN_COLOR,
    ])
  })
})

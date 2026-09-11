import {
  getClusterCircleStyle,
  getClusterCountStyle,
  getStopCircleStyle,
  getStopSymbolStyle,
  NUMBERED_CLUSTER_COUNT_FIELD,
  PIN_COLOR,
  PLAIN_CLUSTER_COUNT_FIELD,
  SELECTED_COLOR,
} from "app/Scenes/CityGuide/utils/constants"

describe(getClusterCountStyle, () => {
  it("reads the numbered cluster count field when numbered", () => {
    expect(getClusterCountStyle(true).textField).toEqual(NUMBERED_CLUSTER_COUNT_FIELD)
  })

  it("reads the plain cluster count field when not numbered", () => {
    expect(getClusterCountStyle(false).textField).toEqual(PLAIN_CLUSTER_COUNT_FIELD)
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

describe(getStopCircleStyle, () => {
  it("colours every pin black when no place is selected", () => {
    expect(getStopCircleStyle(null).circleColor).toBe(PIN_COLOR)
  })

  it("recolours only the selected place's pin purple", () => {
    expect(getStopCircleStyle("place-1").circleColor).toEqual([
      "case",
      ["==", ["get", "id"], "place-1"],
      SELECTED_COLOR,
      PIN_COLOR,
    ])
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

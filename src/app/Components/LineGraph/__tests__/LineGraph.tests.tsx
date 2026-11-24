import { screen } from "@testing-library/react-native"
import { LineGraph } from "app/Components/LineGraph/LineGraph"
import { _AVAILABLE_MEDIUMS, testChartData } from "app/Components/LineGraph/testHelpers"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

// The chart renders SVG only, so render it as a host element we can find
jest.mock("app/Components/LineGraph/LineGraphChart", () => {
  const { View } = require("react-native")
  return { LineGraphChart: () => <View testID="line-graph-chart" /> }
})

describe(LineGraph, () => {
  it("renders correctly", async () => {
    renderWithWrappers(
      <LineGraph
        data={testChartData}
        bands={[{ name: "3 yrs" }, { name: "8 yrs" }]}
        categories={_AVAILABLE_MEDIUMS.map((a) => ({ name: a, color: "#BBBBBB" }))}
        onBandSelected={jest.fn()}
        showHighlights
        selectedCategory={_AVAILABLE_MEDIUMS[0]}
        onCategorySelected={(category) => console.log("SELECTED CATEGORY", category)}
        onXHighlightPressed={jest.fn()}
      />
    )
    // header
    expect(screen.getByText(testChartData.dataMeta.title!)).toBeOnTheScreen()
    expect(screen.getByText(testChartData.dataMeta.description!)).toBeOnTheScreen()
    // chart
    expect(screen.getByTestId("line-graph-chart")).toBeOnTheScreen()
    // bands
    expect(screen.getAllByTestId("band")).toHaveLength(2)
    expect(screen.getByText("3 yrs")).toBeOnTheScreen()
    // category picker
    expect(screen.getByTestId("line-graph-category-picker")).toBeOnTheScreen()
  })

  it("Does not render CategoryPicker if there are no categories", () => {
    renderWithWrappers(
      <LineGraph
        data={testChartData}
        bands={[{ name: "3 yrs" }, { name: "8 yrs" }]}
        onBandSelected={jest.fn()}
        showHighlights
        selectedCategory={_AVAILABLE_MEDIUMS[0]}
        onCategorySelected={jest.fn()}
        onXHighlightPressed={jest.fn()}
      />
    )
    const categoryTabs = screen.queryByTestId("line-graph-category-picker")
    expect(categoryTabs).toBe(null)
  })
})

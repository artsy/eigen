import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { LineGraph } from "./LineGraph"
import { LineGraphBands } from "./LineGraphBands"
import { LineGraphCategoryPicker } from "./LineGraphCategoryPicker"
import { LineGraphChart } from "./LineGraphChart"
import { LineGraphHeader } from "./LineGraphHeader"
import { _AVAILABLE_MEDIUMS, testChartData } from "./testHelpers"

describe(LineGraph, () => {
  it("renders correctly", async () => {
    const { UNSAFE_getByType } = renderWithWrappers(
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
    const header = UNSAFE_getByType(LineGraphHeader)
    const chart = UNSAFE_getByType(LineGraphChart)
    const bands = UNSAFE_getByType(LineGraphBands)
    const categoryTabs = UNSAFE_getByType(LineGraphCategoryPicker)
    expect(header).toBeTruthy()
    expect(chart).toBeTruthy()
    expect(bands).toBeTruthy()
    expect(categoryTabs).toBeTruthy()
  })

  it("Does not render CategoryPicker if there are no categories", () => {
    const { queryByTestId } = renderWithWrappers(
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
    const categoryTabs = queryByTestId("line-graph-category-picker")
    expect(categoryTabs).toBe(null)
  })
})

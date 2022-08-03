import { fireEvent } from "@testing-library/react-native"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { LineGraphDurationPicker } from "./LineGraphBands"
import { LineGraphStoreProvider } from "./LineGraphStore"
import { _AVAILABLE_MEDIUMS } from "./testHelpers"

jest.unmock("react-relay")

describe("LineGraphDurationPicker", () => {
  const getWrapper = () => {
    return (
      <LineGraphStoreProvider
        initialData={{
          totalLots: 50,
          averagePrice: "USD $12,586",
          availableMediums: _AVAILABLE_MEDIUMS,
        }}
      >
        <LineGraphDurationPicker />
      </LineGraphStoreProvider>
    )
  }
  it("has 3 yrs selected as a default duration", () => {
    const { getByText } = renderWithWrappers(getWrapper())
    const threeYearsDurationText = getByText("3 yrs")
    expect(threeYearsDurationText).toBeTruthy()

    // the default duration is 3 years and it's font weight is set to bold
    expect(threeYearsDurationText.props.fontWeight).toBe("500")
  })

  it("switches duration on button press", async () => {
    const { getByTestId, getByText } = renderWithWrappers(getWrapper())
    const threeYearsDurationButton = getByTestId("three-years-button")
    const threeYearsDurationText = getByText("3 yrs")
    const eightYearsDurationButton = getByTestId("eight-years-button")
    const eightYearsDurationText = getByText("8 yrs")

    // Select 8 years as a duration
    fireEvent(eightYearsDurationButton, "press")
    await flushPromiseQueue()
    expect(threeYearsDurationText.props.fontWeight).toBe("400")
    expect(eightYearsDurationText.props.fontWeight).toBe("500")

    // Select 3 years as a duration
    fireEvent(threeYearsDurationButton, "press")
    await flushPromiseQueue()
    expect(eightYearsDurationText.props.fontWeight).toBe("400")
    expect(threeYearsDurationText.props.fontWeight).toBe("500")

    // Reselect 3 years as a duration
    fireEvent(threeYearsDurationButton, "press")
    await flushPromiseQueue()
    expect(eightYearsDurationText.props.fontWeight).toBe("400")
    expect(threeYearsDurationText.props.fontWeight).toBe("500")
  })
})

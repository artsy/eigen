import { fireEvent, screen } from "@testing-library/react-native"
import { TrendingPeriodToggle } from "app/Scenes/Search/TrendingSearches/components/TrendingPeriodToggle"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("TrendingPeriodToggle", () => {
  it("renders all period options", () => {
    renderWithWrappers(<TrendingPeriodToggle value="ONE_DAY" onChange={jest.fn()} />)

    expect(screen.getByText("Today")).toBeOnTheScreen()
    expect(screen.getByText("Past 7 Days")).toBeOnTheScreen()
    expect(screen.getByText("Past 30 Days")).toBeOnTheScreen()
  })

  it("marks the currently selected option via accessibilityState", () => {
    renderWithWrappers(<TrendingPeriodToggle value="SEVEN_DAYS" onChange={jest.fn()} />)

    expect(screen.getByRole("button", { selected: true, name: "Past 7 Days" })).toBeOnTheScreen()
    expect(screen.getByRole("button", { selected: false, name: "Today" })).toBeOnTheScreen()
  })

  it("calls onChange with the tapped period", () => {
    const onChange = jest.fn()
    renderWithWrappers(<TrendingPeriodToggle value="ONE_DAY" onChange={onChange} />)

    fireEvent.press(screen.getByText("Past 30 Days"))

    expect(onChange).toHaveBeenCalledWith("THIRTY_DAYS")
  })
})

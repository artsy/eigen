import { fireEvent, screen } from "@testing-library/react-native"
import { CityEventSectionHeader } from "app/Scenes/CityGuide/Components/CityEventSectionHeader"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("CityEventSectionHeader", () => {
  it("renders its title and reports itself expanded", () => {
    renderWithWrappers(
      <CityEventSectionHeader title="Farringdon" isExpanded onToggle={jest.fn()} />
    )

    expect(screen.getByText("Farringdon")).toBeTruthy()
    expect(screen.getByTestId("city-event-section-header").props.accessibilityState).toEqual(
      expect.objectContaining({ expanded: true })
    )
  })

  it("reports itself collapsed", () => {
    renderWithWrappers(
      <CityEventSectionHeader title="Farringdon" isExpanded={false} onToggle={jest.fn()} />
    )

    expect(screen.getByTestId("city-event-section-header").props.accessibilityState).toEqual(
      expect.objectContaining({ expanded: false })
    )
  })

  it("calls onToggle when pressed", () => {
    const onToggle = jest.fn()

    renderWithWrappers(<CityEventSectionHeader title="Farringdon" isExpanded onToggle={onToggle} />)
    fireEvent.press(screen.getByTestId("city-event-section-header"))

    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})

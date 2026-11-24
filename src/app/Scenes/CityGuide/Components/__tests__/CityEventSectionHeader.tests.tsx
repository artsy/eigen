import { fireEvent, screen } from "@testing-library/react-native"
import { CityEventSectionHeader } from "app/Scenes/CityGuide/Components/CityEventSectionHeader"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("CityEventSectionHeader", () => {
  it("renders its title and reports itself expanded", async () => {
    await renderWithWrappers(
      <CityEventSectionHeader title="Farringdon" isExpanded onToggle={jest.fn()} />
    )

    expect(screen.getByText("Farringdon")).toBeTruthy()
    expect(screen.getByTestId("city-event-section-header").props.accessibilityState).toEqual(
      expect.objectContaining({ expanded: true })
    )
  })

  it("reports itself collapsed", async () => {
    await renderWithWrappers(
      <CityEventSectionHeader title="Farringdon" isExpanded={false} onToggle={jest.fn()} />
    )

    expect(screen.getByTestId("city-event-section-header").props.accessibilityState).toEqual(
      expect.objectContaining({ expanded: false })
    )
  })

  it("calls onToggle when pressed", async () => {
    const onToggle = jest.fn()

    await renderWithWrappers(
      <CityEventSectionHeader title="Farringdon" isExpanded onToggle={onToggle} />
    )
    await fireEvent.press(screen.getByTestId("city-event-section-header"))

    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})

import { fireEvent, screen } from "@testing-library/react-native"
import { Expandable } from "app/Components/Expandable"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"

describe("Expandable", () => {
  it("renders with the provided label", async () => {
    await renderWithWrappers(
      <Expandable label="Test Label">
        <Text>Hidden Content</Text>
      </Expandable>
    )

    expect(screen.getByText("Test Label")).toBeTruthy()
    // Initially hidden
    expect(screen.queryByText("Hidden Content")).toBeNull()
  })

  it("shows content when expanded prop is true", async () => {
    await renderWithWrappers(
      <Expandable label="Test Label" expanded={true}>
        <Text>Visible Content</Text>
      </Expandable>
    )

    // Content should be visible when expanded is true
    expect(screen.getByText("Visible Content")).toBeTruthy()
  })

  it("toggles content visibility when pressed", async () => {
    await renderWithWrappers(
      <Expandable label="Click Me">
        <Text>Toggle Content</Text>
      </Expandable>
    )

    // Initially hidden
    expect(screen.queryByText("Toggle Content")).toBeNull()

    // Click to expand
    await fireEvent.press(screen.getByText("Click Me"))

    // Now visible
    expect(screen.getByText("Toggle Content")).toBeTruthy()

    // Click to collapse
    await fireEvent.press(screen.getByText("Click Me"))

    // Hidden again
    expect(screen.queryByText("Toggle Content")).toBeNull()
  })

  it("calls onTrack when toggled", async () => {
    const trackMock = jest.fn()

    await renderWithWrappers(
      <Expandable label="Track Me" onTrack={trackMock}>
        <Text>Tracked Content</Text>
      </Expandable>
    )

    // Toggle and check if onTrack was called
    await fireEvent.press(screen.getByText("Track Me"))
    expect(trackMock).toHaveBeenCalledTimes(1)
  })
})

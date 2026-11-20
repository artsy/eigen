import { fireEvent, screen } from "@testing-library/react-native"
import { DarkModeSettings } from "app/Scenes/MyProfile/DarkModeSettings"
import { GlobalStore, GlobalStoreProvider } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

// Expose each RadioButton's `selected` prop as a checked radio host element
jest.mock("@artsy/palette-mobile", () => {
  const { View } = require("react-native")
  return {
    ...jest.requireActual("@artsy/palette-mobile"),
    RadioButton: ({ selected }: { selected?: boolean }) => (
      <View
        testID="radio-button"
        accessible
        accessibilityRole="radio"
        accessibilityState={{ checked: !!selected }}
      />
    ),
  }
})

describe("DarkModeSettings", () => {
  const TestWrapper = () => {
    return (
      <GlobalStoreProvider>
        <DarkModeSettings />
      </GlobalStoreProvider>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset to default state for each test
    GlobalStore.actions.devicePrefs.setDarkModeOption("system")
  })

  it("renders dark mode settings options", () => {
    renderWithWrappers(<TestWrapper />)

    expect(screen.getByText("Sync with system")).toBeOnTheScreen()
    expect(screen.getByText("On")).toBeOnTheScreen()
    expect(screen.getByText("Off")).toBeOnTheScreen()
  })

  it("shows correct initial state from GlobalStore", () => {
    GlobalStore.actions.devicePrefs.setDarkModeOption("on")
    renderWithWrappers(<TestWrapper />)

    // The "On" option's radio button should be selected, not the others
    const radioButtons = screen.getAllByTestId("radio-button")
    expect(radioButtons).toHaveLength(3)

    expect(radioButtons[0]).not.toBeChecked() // "Sync with system"
    expect(radioButtons[1]).toBeChecked() // "On"
    expect(radioButtons[2]).not.toBeChecked() // "Off"
  })

  it("changes dark mode option to 'on' when 'On' is pressed", () => {
    const setDarkModeOptionSpy = jest.spyOn(GlobalStore.actions.devicePrefs, "setDarkModeOption")
    renderWithWrappers(<TestWrapper />)

    fireEvent.press(screen.getByText("On"))

    expect(setDarkModeOptionSpy).toHaveBeenCalledWith("on")
  })

  it("changes dark mode option to 'off' when 'Off' is pressed", () => {
    const setDarkModeOptionSpy = jest.spyOn(GlobalStore.actions.devicePrefs, "setDarkModeOption")
    renderWithWrappers(<TestWrapper />)

    fireEvent.press(screen.getByText("Off"))

    expect(setDarkModeOptionSpy).toHaveBeenCalledWith("off")
  })

  it("changes dark mode option to 'system' when 'Sync with system' is pressed", () => {
    // First set a different option so we can test changing back to system
    GlobalStore.actions.devicePrefs.setDarkModeOption("off")
    const setDarkModeOptionSpy = jest.spyOn(GlobalStore.actions.devicePrefs, "setDarkModeOption")

    renderWithWrappers(<TestWrapper />)

    fireEvent.press(screen.getByText("Sync with system"))

    expect(setDarkModeOptionSpy).toHaveBeenCalledWith("system")
  })

  it("updates UI state when dark mode option changes", () => {
    renderWithWrappers(<TestWrapper />)

    // Initially "System" should be selected
    let radioButtons = screen.getAllByTestId("radio-button")
    expect(radioButtons[0]).toBeChecked() // "Sync with system"
    expect(radioButtons[1]).not.toBeChecked() // "On"
    expect(radioButtons[2]).not.toBeChecked() // "Off"

    // Change selection to "On"
    fireEvent.press(screen.getByText("On"))

    // Now "On" should be selected
    radioButtons = screen.getAllByTestId("radio-button")
    expect(radioButtons[0]).not.toBeChecked() // "Sync with system"
    expect(radioButtons[1]).toBeChecked() // "On"
    expect(radioButtons[2]).not.toBeChecked() // "Off"
  })
})

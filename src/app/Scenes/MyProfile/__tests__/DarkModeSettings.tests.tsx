import { RadioButton } from "@artsy/palette-mobile"
import { fireEvent, screen } from "@testing-library/react-native"
import { DarkModeSettings } from "app/Scenes/MyProfile/DarkModeSettings"
import { GlobalStore, GlobalStoreProvider } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

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

    expect(screen.getByText("Sync with system")).toBeTruthy()
    expect(screen.getByText("On")).toBeTruthy()
    expect(screen.getByText("Off")).toBeTruthy()
  })

  it("shows correct initial state from GlobalStore", async () => {
    GlobalStore.actions.devicePrefs.setDarkModeOption("on")
    const { root } = renderWithWrappers(<TestWrapper />)

    // The "On" option's radio button should be selected, not the others
    const radioButtons = await root.findAllByType(RadioButton)
    expect(radioButtons).toHaveLength(3)

    expect(radioButtons[0].props.selected).toBe(false) // "Sync with system"
    expect(radioButtons[1].props.selected).toBe(true) // "On"
    expect(radioButtons[2].props.selected).toBe(false) // "Off"
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

  it("updates UI state when dark mode option changes", async () => {
    const { root } = renderWithWrappers(<TestWrapper />)

    // Initially "System" should be selected
    let radioButtons = await root.findAllByType(RadioButton)
    expect(radioButtons[0].props.selected).toBe(true) // "Sync with system"
    expect(radioButtons[1].props.selected).toBe(false) // "On"
    expect(radioButtons[2].props.selected).toBe(false) // "Off"

    // Change selection to "On"
    fireEvent.press(screen.getByText("On"))

    // Now "On" should be selected
    radioButtons = await root.findAllByType(RadioButton)
    expect(radioButtons[0].props.selected).toBe(false) // "Sync with system"
    expect(radioButtons[1].props.selected).toBe(true) // "On"
    expect(radioButtons[2].props.selected).toBe(false) // "Off"
  })
})

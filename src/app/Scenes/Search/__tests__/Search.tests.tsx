import { fireEvent, screen } from "@testing-library/react-native"
import { ICON_HIT_SLOP } from "app/Components/constants"
import { SearchScreen } from "app/Scenes/Search/Search"
import { SearchPlaceholder } from "app/Scenes/Search/components/placeholders/SearchPlaceholder"
import { navigate } from "app/system/navigation/navigate"
import { useEnableArtAssistant } from "app/utils/hooks/useEnableArtAssistant"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("lodash/throttle", () => (fn: any) => {
  fn.flush = jest.fn()
  return fn
})

jest.mock("app/utils/hooks/useEnableArtAssistant", () => ({
  useEnableArtAssistant: jest.fn(),
}))

jest.mock("app/system/navigation/navigate", () => ({
  navigate: jest.fn(),
}))

describe("Search", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useEnableArtAssistant).mockReturnValue(false)
  })

  it("should render a text input with placeholder and no pills", async () => {
    renderWithWrappers(<SearchScreen route={{} as any} navigation={{} as any} />)

    await screen.findByPlaceholderText("Search Artsy")

    const searchInput = screen.getByPlaceholderText("Search Artsy")

    expect(searchInput).toBeOnTheScreen()

    // Pill should not be visible
    expect(screen.queryByText("Artists")).not.toBeOnTheScreen()

    // should show City Guide
    expect(screen.getByText("City Guide")).toBeOnTheScreen()

    fireEvent.changeText(searchInput, "Ba")
  })

  it("hides the Art Assistant entry point when its experiment is off", async () => {
    renderWithWrappers(<SearchScreen route={{} as any} navigation={{} as any} />)

    await screen.findByPlaceholderText("Search Artsy")

    expect(screen.queryByTestId("art-assistant-search-button")).not.toBeOnTheScreen()
  })

  it("opens Art Assistant when its experiment is on", async () => {
    jest.mocked(useEnableArtAssistant).mockReturnValue(true)

    renderWithWrappers(<SearchScreen route={{} as any} navigation={{} as any} />)

    await screen.findByPlaceholderText("Search Artsy")
    const button = screen.getByTestId("art-assistant-search-button")

    expect(button).toHaveProp("hitSlop", ICON_HIT_SLOP)

    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith("/art-assistant")
  })

  it("reserves space for the Art Assistant entry point while Search is loading", () => {
    jest.mocked(useEnableArtAssistant).mockReturnValue(true)

    renderWithWrappers(<SearchPlaceholder />)

    expect(screen.getByTestId("art-assistant-search-button-placeholder")).toBeOnTheScreen()
  })
})

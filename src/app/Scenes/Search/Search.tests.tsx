import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { SEARCH_PILLS } from "app/Scenes/Search/constants"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { SearchScreen } from "./Search"

jest.mock("lodash/throttle", () => (fn: any) => {
  fn.flush = jest.fn()
  return fn
})

describe("Search", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <SearchScreen />,
  })

  it("should render a text input with placeholder and no pills", async () => {
    const { env } = renderWithRelay()

    const searchInput = screen.getByPlaceholderText("Search artists, artworks, galleries, etc")

    expect(searchInput).toBeTruthy()

    // Pill should not be visible
    expect(screen.queryByText("Artists")).toBeFalsy()

    // should show City Guide
    expect(screen.getByText("City Guide")).toBeTruthy()
    expect(screen.getByText("Recent Searches")).toBeTruthy()

    fireEvent.changeText(searchInput, "Ba")

    // needed to resolve the second relay operation triggered for the text change > 2
    resolveMostRecentRelayOperation(env)

    // Pills should be visible
    await waitFor(() => {
      screen.getByText("Artworks")
      screen.getByText("Top")
    })
  })

  it("Top pill should be selected by default", async () => {
    const { env } = renderWithRelay()

    const searchInput = screen.getByPlaceholderText("Search artists, artworks, galleries, etc")

    fireEvent.changeText(searchInput, "text")

    // needed to resolve the second relay operation triggered for the text change > 2
    resolveMostRecentRelayOperation(env, {})

    expect(screen.getByA11yState({ selected: true })).toHaveTextContent("Top")
  })

  it("when clear button is pressed", async () => {
    const { env } = renderWithRelay()

    const searchInput = screen.getByPlaceholderText("Search artists, artworks, galleries, etc")

    fireEvent(searchInput, "changeText", "prev value")

    // needed to resolve the second relay operation triggered for the text change
    resolveMostRecentRelayOperation(env)

    fireEvent(screen.getByText("Artworks"), "press")

    fireEvent(screen.getByLabelText("Clear input button"), "press")

    fireEvent(searchInput, "changeText", "new value")
    // needed to resolve the relay operation triggered for the text change
    resolveMostRecentRelayOperation(env)

    expect(screen.queryByA11yState({ selected: true })).toHaveTextContent("Top")
  })

  it("when cancel button is pressed", async () => {
    const { env } = renderWithRelay()

    const searchInput = screen.getByPlaceholderText("Search artists, artworks, galleries, etc")

    fireEvent(searchInput, "changeText", "prev value")
    // needed to resolve the relay operation triggered for the text change
    resolveMostRecentRelayOperation(env)

    fireEvent(screen.getByText("Artworks"), "press")

    fireEvent(searchInput, "focus")
    fireEvent(screen.getByTestId("clear-input-button"), "press")

    fireEvent(searchInput, "changeText", "new value")
    // needed to resolve the relay operation triggered for the text change
    resolveMostRecentRelayOperation(env)

    expect(screen.queryByA11yState({ selected: true })).toHaveTextContent("Top")
  })

  it("should render all the default pills", async () => {
    const { env } = renderWithRelay()

    const searchInput = screen.getByPlaceholderText("Search artists, artworks, galleries, etc")

    fireEvent(searchInput, "changeText", "Ba")

    // needed to resolve the second relay operation triggered for the text change > 2
    resolveMostRecentRelayOperation(env)

    SEARCH_PILLS.forEach((pill) => {
      expect(screen.getByText(pill.displayName)).toBeTruthy()
    })
  })
})

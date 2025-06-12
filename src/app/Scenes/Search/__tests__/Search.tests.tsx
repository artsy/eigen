import { fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { SearchScreen } from "app/Scenes/Search/Search"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

jest.mock("lodash/throttle", () => (fn: any) => {
  fn.flush = jest.fn()
  return fn
})

describe("Search", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <SearchScreen route={{} as any} navigation={{} as any} />,
  })

  it("should render a text input with placeholder and no pills", async () => {
    renderWithRelay()

    await waitForElementToBeRemoved(() => screen.queryByTestId("search-placeholder"))

    const searchInput = screen.getByPlaceholderText("Search Artsy")

    expect(searchInput).toBeOnTheScreen()

    // Pill should not be visible
    expect(screen.queryByText("Artists")).not.toBeOnTheScreen()

    // should show City Guide
    expect(screen.getByText("City Guide")).toBeOnTheScreen()

    fireEvent.changeText(searchInput, "Ba")
  })
})

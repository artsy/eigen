import { fireEvent, screen } from "@testing-library/react-native"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { SearchScreen } from "./Search"

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

    const searchInput = screen.getByPlaceholderText("Search Artsy")

    expect(searchInput).toBeTruthy()

    // Pill should not be visible
    expect(screen.queryByText("Artists")).toBeFalsy()

    // should show City Guide
    expect(screen.getByText("City Guide")).toBeTruthy()

    fireEvent.changeText(searchInput, "Ba")
  })
})

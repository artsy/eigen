import { fireEvent, screen } from "@testing-library/react-native"
import { SearchScreen } from "app/Scenes/Search/Search"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("lodash/throttle", () => (fn: any) => {
  fn.flush = jest.fn()
  return fn
})

describe("Search", () => {
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
})

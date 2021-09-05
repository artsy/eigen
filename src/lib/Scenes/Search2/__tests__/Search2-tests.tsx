import { fireEvent } from "@testing-library/react-native"
import { Search } from "lib/Scenes/Search"
import { GlobalStoreProvider } from "lib/store/GlobalStore"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import { CatchErrors } from "lib/utils/CatchErrors"
import { Theme } from "palette"
import React from "react"
import { Search2 } from "../Search2"

jest.mock("lib/utils/hardware", () => ({
  isPad: jest.fn(),
}))

jest.mock("../../Search/AutosuggestResults.tsx", () => ({ AutosuggestResults: () => null }))
jest.mock("../../Search/RecentSearches", () => ({
  RecentSearches: () => null,
  ProvideRecentSearches: ({ children }: any) => children,
  RecentSearchContext: {
    useStoreState: () => [],
  },
  getRecentSearches: jest.fn(() => []),
}))

const TestWrapper: typeof Search = () => {
  return (
    <GlobalStoreProvider>
      <Theme>
        <CatchErrors>
          <GlobalStoreProvider>
            <Search2
              system={{
                __typename: "System",
                algolia: { appID: "", apiKey: "", indices: [{ name: "Artist_staging", displayName: "Artists" }] },
              }}
            />
          </GlobalStoreProvider>
        </CatchErrors>
      </Theme>
    </GlobalStoreProvider>
  )
}

describe("Search2 Screen", () => {
  it("should render a text input with placeholder", async () => {
    const { getByPlaceholderText, getByText, queryByText } = renderWithWrappersTL(<TestWrapper />)

    const searchInput = getByPlaceholderText("Search artists, artworks, galleries, etc")

    // Pill should not be visible
    expect(queryByText("Artists")).toBeFalsy()

    fireEvent.changeText(searchInput, "Ba")
    expect(searchInput).toHaveProp("value", "Ba")

    // Pill should be visible
    expect(getByText("Artists")).toBeTruthy()
  })
})

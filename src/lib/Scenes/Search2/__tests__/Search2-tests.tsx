import { fireEvent } from "@testing-library/react-native"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { createMockEnvironment } from "relay-test-utils"
import { Search2QueryRenderer } from "../Search2"

jest.unmock("react-relay")
jest.mock("lib/utils/hardware", () => ({
  isPad: jest.fn(),
}))
jest.mock("lib/utils/useSearchInsightsConfig", () => ({
  useSearchInsightsConfig: () => true,
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

describe("Search2 Screen", () => {
  const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment.mockClear()
  })

  const TestRenderer = () => {
    return <Search2QueryRenderer />
  }

  it("should render a text input with placeholder", async () => {
    const { getByPlaceholderText, getByText, queryByText } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Algolia: () => ({
        appID: "",
        apiKey: "",
        indices: [{ name: "Artist_staging", displayName: "Artists" }],
      }),
    })

    const searchInput = getByPlaceholderText("Search artists, artworks, galleries, etc")

    // Pill should not be visible
    expect(queryByText("Artists")).toBeFalsy()

    fireEvent.changeText(searchInput, "Ba")
    expect(searchInput).toHaveProp("value", "Ba")

    // Pill should be visible
    expect(getByText("Artists")).toBeTruthy()
  })
})

import { fireEvent, RenderAPI, waitFor } from "@testing-library/react-native"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { RecentSearch } from "lib/Scenes/Search/SearchModel"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import { isPad } from "lib/utils/hardware"
import React from "react"
import { createMockEnvironment } from "relay-test-utils"
import { Search2QueryRenderer } from "../Search2"

const banksy: RecentSearch = {
  type: "AUTOSUGGEST_RESULT_TAPPED",
  props: {
    displayLabel: "Banksy",
    displayType: "Artist",
    href: "https://artsy.com/artist/banksy",
    imageUrl: "https://org-name.my-cloud-provider.com/bucket-hash/content-hash.jpg",
    __typename: "Artist",
  },
}

jest.unmock("react-relay")
jest.mock("lib/utils/hardware", () => ({
  isPad: jest.fn(),
}))
jest.mock("lib/utils/useSearchInsightsConfig", () => ({
  useSearchInsightsConfig: () => true,
}))

jest.mock("../../Search/AutosuggestResults.tsx", () => ({ AutosuggestResults: () => null }))

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

    // should show City Guide
    expect(getByText("City Guide")).toBeTruthy()
    expect(getByText("Recent searches")).toBeTruthy()

    fireEvent.changeText(searchInput, "Ba")
    expect(searchInput).toHaveProp("value", "Ba")

    // Pills should be visible
    await waitFor(() => {
      getByText("Artworks")
      getByText("Artists")
    })
  })

  it("does not show city guide entrance when on iPad", () => {
    const isPadMock = isPad as jest.Mock
    isPadMock.mockImplementationOnce(() => true)
    const { queryByText } = renderWithWrappersTL(<TestRenderer />)
    expect(queryByText("City Guide")).toBeFalsy()
  })

  it("shows city guide entrance when there are recent searches", () => {
    __globalStoreTestUtils__?.injectState({
      search: {
        recentSearches: [banksy],
      },
    })
    const isPadMock = isPad as jest.Mock
    isPadMock.mockImplementationOnce(() => false)
    const { getByText } = renderWithWrappersTL(<TestRenderer />)
    expect(getByText("Explore art on view")).toBeTruthy()
  })

  it("shows the cancel button when the input focuses", () => {
    const { queryByText, getByPlaceholderText } = renderWithWrappersTL(<TestRenderer />)

    expect(queryByText("Cancel")).toBeFalsy()

    const searchInput = getByPlaceholderText("Search artists, artworks, galleries, etc")

    fireEvent(searchInput, "focus")
    expect(queryByText("Cancel")).toBeTruthy()
  })

  it("selects artworks pill only when the user has typed the minimum allowed number of characters", () => {
    const { queryByA11yState, getByPlaceholderText } = renderWithWrappersTL(<TestRenderer />)
    const searchInput = getByPlaceholderText("Search artists, artworks, galleries, etc")

    fireEvent(searchInput, "submitEditing")

    expect(queryByA11yState({ selected: true })).toBeFalsy()
  })

  it("selects artworks pill when the search input is submitted", () => {
    const { getByA11yState, getByPlaceholderText } = renderWithWrappersTL(<TestRenderer />)
    const searchInput = getByPlaceholderText("Search artists, artworks, galleries, etc")

    fireEvent.changeText(searchInput, "text")
    fireEvent(searchInput, "submitEditing")

    expect(getByA11yState({ selected: true })).toHaveTextContent("Artworks")
  })

  describe("Reset the state of the pills", () => {
    let tree: RenderAPI

    beforeEach(() => {
      tree = renderWithWrappersTL(<TestRenderer />)

      mockEnvironmentPayload(mockEnvironment, {
        Algolia: () => ({
          appID: "",
          apiKey: "",
          indices: [
            {
              name: "Artist_staging",
              displayName: "Artists",
            },
          ],
        }),
      })
    })

    it("when search query is empty", () => {
      const { queryByA11yState, getByPlaceholderText, getByText } = tree
      const searchInput = getByPlaceholderText("Search artists, artworks, galleries, etc")

      fireEvent(searchInput, "changeText", "prev value")
      fireEvent(getByText("Artists"), "press")
      fireEvent(searchInput, "changeText", "")
      fireEvent(searchInput, "changeText", "new value")

      expect(queryByA11yState({ selected: true })).toBeFalsy()
    })

    it("when clear button is pressed", () => {
      const { queryByA11yState, getByPlaceholderText, getByText, getByA11yLabel } = tree
      const searchInput = getByPlaceholderText("Search artists, artworks, galleries, etc")

      fireEvent(searchInput, "changeText", "prev value")
      fireEvent(getByText("Artists"), "press")
      fireEvent(getByA11yLabel("Clear input button"), "press")
      fireEvent(searchInput, "changeText", "new value")

      expect(queryByA11yState({ selected: true })).toBeFalsy()
    })

    it("when cancel button is pressed", () => {
      const { queryByA11yState, getByPlaceholderText, getByText } = tree
      const searchInput = getByPlaceholderText("Search artists, artworks, galleries, etc")

      fireEvent(searchInput, "changeText", "prev value")
      fireEvent(getByText("Artists"), "press")
      fireEvent(searchInput, "focus")
      fireEvent(getByText("Cancel"), "press")
      fireEvent(searchInput, "changeText", "new value")

      expect(queryByA11yState({ selected: true })).toBeFalsy()
    })
  })
})

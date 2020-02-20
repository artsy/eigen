import { extractText } from "lib/tests/extractText"
import React from "react"
import { TextInput } from "react-native"
import ReactTestRenderer, { act } from "react-test-renderer"
import { CatchErrors } from "../../../utils/CatchErrors"
import { AutosuggestResults } from "../AutosuggestResults"
import { RecentSearches, useRecentSearches } from "../RecentSearches"
import { Search } from "../Search"

jest.mock("../AutosuggestResults", () => ({ AutosuggestResults: () => null }))
jest.mock("../RecentSearches", () => ({
  RecentSearches: () => null,
  ProvideRecentSearches: ({ children }) => children,
  useRecentSearches: jest.fn(() => ({
    recentSearches: [],
    notifyRecentSearch: jest.fn(),
    deleteRecentSearch: jest.fn(),
  })),
}))

const useRecentSearchesMock = useRecentSearches as jest.Mock<ReturnType<typeof useRecentSearches>>

const TestWrapper: typeof Search = props => (
  <CatchErrors>
    <Search {...props} />
  </CatchErrors>
)

describe("The Search page", () => {
  it(`has an empty state`, async () => {
    const tree = ReactTestRenderer.create(<TestWrapper />)
    expect(extractText(tree.root)).toContain("Search for artists, artworks, galleries, shows, and more")
    expect(tree.root.findAllByType(RecentSearches)).toHaveLength(0)
    expect(tree.root.findAllByType(AutosuggestResults)).toHaveLength(0)
  })

  it(`shows recent searches when there are recent searches`, () => {
    useRecentSearchesMock.mockReturnValueOnce({
      recentSearches: [
        {
          type: "AUTOSUGGEST_RESULT_TAPPED",
          props: {
            displayLabel: "Banksy",
            displayType: "Artist",
            href: "",
            imageUrl: "",
          },
        },
      ],
      notifyRecentSearch: jest.fn(),
      deleteRecentSearch: jest.fn(),
    })

    const tree = ReactTestRenderer.create(<TestWrapper />)
    expect(extractText(tree.root)).not.toContain("Search for artists, artworks, galleries, shows, and more")
    expect(tree.root.findAllByType(RecentSearches)).toHaveLength(1)
    expect(tree.root.findAllByType(AutosuggestResults)).toHaveLength(0)
  })

  it(`shows the cancel button when the input focues`, () => {
    const tree = ReactTestRenderer.create(<TestWrapper />)
    expect(extractText(tree.root)).not.toContain("Cancel")
    act(() => {
      tree.root.findByType(TextInput).props.onFocus()
    })
    expect(extractText(tree.root)).toContain("Cancel")
  })

  it(`passes the query to the AutosuggestResults when the query.length is >= 2`, async () => {
    const tree = ReactTestRenderer.create(<TestWrapper />)

    act(() => {
      tree.root.findByType(TextInput).props.onChangeText("m")
    })

    expect(tree.root.findAllByType(AutosuggestResults)).toHaveLength(0)

    act(() => {
      tree.root.findByType(TextInput).props.onChangeText("mi")
    })

    expect(tree.root.findAllByType(AutosuggestResults)).toHaveLength(1)

    act(() => {
      tree.root.findByType(TextInput).props.onChangeText("michael")
    })

    expect(tree.root.findAllByType(RecentSearches)).toHaveLength(0)
    expect(tree.root.findAllByType(AutosuggestResults)).toHaveLength(1)
    expect(tree.root.findByType(AutosuggestResults).props.query).toBe("michael")
  })
})

import { act, fireEvent, screen } from "@testing-library/react-native"
import { AutosuggestResultsPaginationQuery$rawResponse } from "__generated__/AutosuggestResultsPaginationQuery.graphql"
import { AutosuggestResultsQuery$rawResponse } from "__generated__/AutosuggestResultsQuery.graphql"
import { AutosuggestResults } from "app/Components/AutosuggestResults/AutosuggestResults"
import { SearchContext } from "app/Scenes/Search/SearchContext"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { rejectMostRecentRelayOperation } from "app/utils/tests/rejectMostRecentRelayOperation"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { createMockEnvironment } from "relay-test-utils"

const FixturePage1: AutosuggestResultsQuery$rawResponse = {
  results: {
    edges: [
      {
        cursor: "page-1",
        node: {
          __isNode: "SearchableItem",
          __typename: "SearchableItem",
          internalID: "",
          displayLabel: "Banksy",
          displayType: "Artist",
          href: "banksy-href",
          id: "banksy",
          imageUrl: "",
          slug: "",
        },
      },
    ],
    pageInfo: {
      endCursor: "page-2",
      hasNextPage: true,
    },
  },
}
const FixturePage2: AutosuggestResultsPaginationQuery$rawResponse = {
  results: {
    edges: [
      {
        cursor: "page-2",
        node: {
          __isNode: "SearchableItem",
          __typename: "SearchableItem",
          internalID: "",
          displayLabel: "Andy Warhol",
          displayType: "Artist",
          href: "andy-warhol-href",
          id: "andy-warhol",
          imageUrl: "",
          slug: "",
        },
      },
    ],
    pageInfo: {
      endCursor: "page-3",
      hasNextPage: true,
    },
  },
}

const FixturePage3: AutosuggestResultsPaginationQuery$rawResponse = {
  results: {
    edges: [
      {
        cursor: "page-3",
        node: {
          __isNode: "SearchableItem",
          __typename: "SearchableItem",
          internalID: "",
          displayLabel: "Alex Katz",
          displayType: "Artist",
          href: "alex-katz-href",
          id: "alex-katz",
          imageUrl: "",
          slug: "",
        },
      },
    ],
    pageInfo: {
      endCursor: null,
      hasNextPage: false,
    },
  },
}

const FixtureEmpty: AutosuggestResultsQuery$rawResponse = {
  results: {
    edges: [],
    pageInfo: {
      endCursor: null,
      hasNextPage: false,
    },
  },
}

const inputBlurMock = jest.fn()

const RESULT_TEST_ID = /^autosuggest-search-result-/

const TestWrapper: typeof AutosuggestResults = (props) => (
  <SearchContext.Provider
    value={{ inputRef: { current: { blur: inputBlurMock } as any }, queryRef: { current: "" } }}
  >
    <AutosuggestResults {...props} />
  </SearchContext.Provider>
)

jest.mock("lodash/throttle", () => (f: any) => f)

// app/Scenes/Search/RecentSearches.tsx
jest.mock("app/Scenes/Search/RecentSearches", () => {
  const notifyRecentSearch = jest.fn()
  return {
    useRecentSearches() {
      return { notifyRecentSearch }
    },
  }
})

const notifyRecentSearchMock = require("app/Scenes/Search/RecentSearches").useRecentSearches()
  .notifyRecentSearch

const consoleErrorMock = jest.fn()
const whiteListErrors = [
  "Warning: An update to %s inside a test was not wrapped in act(...).",
  "Bad connection",
]

console.error = (...args: any[]) => {
  let error = args[0]

  if (error instanceof Error) {
    error = error.message
  }

  if (whiteListErrors.some((errorMessage) => error.startsWith(errorMessage))) {
    return
  }
  consoleErrorMock(...args)
}

describe("AutosuggestResults", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = getMockRelayEnvironment()
    consoleErrorMock.mockClear()
    notifyRecentSearchMock.mockClear()
    inputBlurMock.mockClear()
  })

  afterEach(() => {
    expect(consoleErrorMock).not.toHaveBeenCalled()
  })

  it(`has no elements to begin with`, async () => {
    renderWithWrappers(<TestWrapper query="" />)

    expect(screen.queryAllByTestId(RESULT_TEST_ID)).toHaveLength(0)
  })

  it(`has some elements to begin with if you give it some`, async () => {
    renderWithWrappers(<TestWrapper query="michael" />)

    expect(screen.queryAllByTestId(RESULT_TEST_ID)).toHaveLength(0)

    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "AutosuggestResultsQuery"
    )
    expect(env.mock.getMostRecentOperation().request.variables.query).toBe("michael")

    act(() => {
      env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage1 })
    })

    expect(screen.getAllByTestId(RESULT_TEST_ID)).toHaveLength(1)
  })

  it(`doesn't call loadMore until you start scrolling`, () => {
    renderWithWrappers(<TestWrapper query="michael" />)
    act(() => {
      env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage1 })
    })

    expect(screen.getAllByTestId(RESULT_TEST_ID)).toHaveLength(1)

    expect(env.mock.getAllOperations()).toHaveLength(0)

    // even if InfiniteScrollFlashList calls onEndReached, we ignore it until the user explicitly scrolls
    fireEvent(screen.getByTestId("autosuggest-results-list"), "onEndReached")

    expect(env.mock.getAllOperations()).toHaveLength(0)

    fireEvent(screen.getByTestId("autosuggest-results-list"), "scrollBeginDrag")

    expect(env.mock.getAllOperations()).toHaveLength(1)
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "AutosuggestResultsPaginationQuery"
    )
    expect(env.mock.getMostRecentOperation().request.variables.cursor).toBe("page-2")

    act(() => {
      env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage2 })
    })

    expect(screen.getAllByTestId(RESULT_TEST_ID)).toHaveLength(2)
    expect(screen.getByText("Banksy")).toBeOnTheScreen()
    expect(screen.getByText("Andy Warhol")).toBeOnTheScreen()

    // and it works if onEndReached is called now
    fireEvent(screen.getByTestId("autosuggest-results-list"), "onEndReached")
    expect(env.mock.getAllOperations()).toHaveLength(1)
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "AutosuggestResultsPaginationQuery"
    )
    expect(env.mock.getMostRecentOperation().request.variables.cursor).toBe("page-3")

    act(() => {
      env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage3 })
    })

    expect(screen.getAllByTestId(RESULT_TEST_ID)).toHaveLength(3)

    expect(screen.getByText("Andy Warhol")).toBeOnTheScreen()
    expect(screen.getByText("Alex Katz")).toBeOnTheScreen()
    expect(screen.getByText("Banksy")).toBeOnTheScreen()
  })

  it(`shows the loading spinner until there's no more data`, async () => {
    renderWithWrappers(<TestWrapper query="michael" />)
    act(() => env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage1 }))

    expect(screen.getByTestId("autosuggest-results-spinner")).toBeOnTheScreen()

    fireEvent(screen.getByTestId("autosuggest-results-list"), "scrollBeginDrag")
    act(() => env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage2 }))

    expect(screen.getByTestId("autosuggest-results-spinner")).toBeOnTheScreen()

    fireEvent(screen.getByTestId("autosuggest-results-list"), "onEndReached")
    act(() => env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage3 }))

    expect(screen.queryByTestId("autosuggest-results-spinner")).not.toBeOnTheScreen()
  })

  it(`gives an appropriate message when there's no search results`, () => {
    renderWithWrappers(<TestWrapper query="michael" />)
    act(() => env.mock.resolveMostRecentOperation({ errors: [], data: FixtureEmpty }))

    expect(screen.queryAllByTestId(RESULT_TEST_ID)).toHaveLength(0)
    expect(screen.getByText("Sorry, we couldn’t find anything for “michael.”")).toBeOnTheScreen()
    expect(
      screen.getByText("Please try searching again with a different spelling.")
    ).toBeOnTheScreen()
  })

  it(`optionally hides the result type`, () => {
    renderWithWrappers(<TestWrapper query="michael" showResultType={false} />)
    act(() => env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage1 }))

    expect(screen.queryByText("Artist")).not.toBeOnTheScreen()
  })

  it(`allows for custom touch handlers on search result items`, () => {
    const spy = jest.fn()
    renderWithWrappers(<TestWrapper query="michael" showResultType={false} onResultPress={spy} />)
    act(() => env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage1 }))

    fireEvent.press(screen.getByTestId("autosuggest-search-result-Banksy"))
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ displayLabel: "Banksy" }))
  })

  it("should show the loading placeholder ", () => {
    renderWithWrappers(<TestWrapper query="michael" />)

    expect(screen.getByLabelText("Autosuggest results are loading")).toBeOnTheScreen()
  })

  it("should hide the loading placeholder when results are received", () => {
    renderWithWrappers(<TestWrapper query="michael" />)

    act(() => env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage1 }))

    expect(screen.queryByLabelText("Autosuggest results are loading")).toBeFalsy()
  })

  it("should show the default error message", async () => {
    renderWithWrappers(<TestWrapper query="michael" />)

    rejectMostRecentRelayOperation(env, new Error("Bad connection"))

    expect(screen.getByText("There seems to be a problem with the connection.")).toBeTruthy()
    expect(screen.getByText("Please try again shortly.")).toBeTruthy()
  })

  it("should show the unable to load error message when showOnRetryErrorMessage prop is true", () => {
    renderWithWrappers(<TestWrapper query="michael" showOnRetryErrorMessage />)

    rejectMostRecentRelayOperation(env, new Error("Bad connection"))

    expect(screen.getByText("Something went wrong.")).toBeTruthy()
    expect(screen.getByText("Please adjust your query or try again shortly.")).toBeTruthy()
  })
})

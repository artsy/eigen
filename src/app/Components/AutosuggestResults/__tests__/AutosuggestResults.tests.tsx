import { fireEvent, screen } from "@testing-library/react-native"
import { AutosuggestResultsPaginationQuery$rawResponse } from "__generated__/AutosuggestResultsPaginationQuery.graphql"
import { AutosuggestResultsQuery$rawResponse } from "__generated__/AutosuggestResultsQuery.graphql"
import { AutosuggestResults } from "app/Components/AutosuggestResults/AutosuggestResults"
import { InfiniteScrollFlashList } from "app/Components/InfiniteScrollFlashList"
import Spinner from "app/Components/Spinner"
import { SearchContext } from "app/Scenes/Search/SearchContext"
import { AutosuggestSearchResult } from "app/Scenes/Search/components/AutosuggestSearchResult"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { CatchErrors } from "app/utils/CatchErrors"
import { rejectMostRecentRelayOperation } from "app/utils/tests/rejectMostRecentRelayOperation"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { act } from "react-test-renderer"
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

const TestWrapper: typeof AutosuggestResults = (props) => (
  <SearchContext.Provider
    value={{ inputRef: { current: { blur: inputBlurMock } as any }, queryRef: { current: "" } }}
  >
    <CatchErrors>
      <AutosuggestResults {...props} />
    </CatchErrors>
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

    expect(screen.UNSAFE_queryByType(AutosuggestSearchResult)).not.toBeOnTheScreen()
  })

  it(`has some elements to begin with if you give it some`, async () => {
    renderWithWrappers(<TestWrapper query="michael" />)

    expect(screen.UNSAFE_queryByType(AutosuggestSearchResult)).toBeFalsy()

    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "AutosuggestResultsQuery"
    )
    expect(env.mock.getMostRecentOperation().request.variables.query).toBe("michael")

    act(() => {
      env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage1 })
    })

    expect(screen.UNSAFE_getByType(AutosuggestSearchResult)).toBeTruthy()
  })

  it(`doesn't call loadMore until you start scrolling`, () => {
    renderWithWrappers(<TestWrapper query="michael" />)
    act(() => {
      env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage1 })
    })

    expect(screen.UNSAFE_getByType(AutosuggestSearchResult)).toBeTruthy()

    expect(env.mock.getAllOperations()).toHaveLength(0)

    // even if InfiniteScrollFlashList calls onEndReached, we ignore it until the user explicitly scrolls
    fireEvent(screen.UNSAFE_getByType(InfiniteScrollFlashList), "onEndReached")

    expect(env.mock.getAllOperations()).toHaveLength(0)

    fireEvent(screen.UNSAFE_getByType(InfiniteScrollFlashList), "onScrollBeginDrag")

    expect(env.mock.getAllOperations()).toHaveLength(1)
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "AutosuggestResultsPaginationQuery"
    )
    expect(env.mock.getMostRecentOperation().request.variables.cursor).toBe("page-2")

    act(() => {
      env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage2 })
    })

    expect(screen.UNSAFE_queryAllByType(AutosuggestSearchResult)).toHaveLength(2)
    expect(screen.getByText("Banksy")).toBeOnTheScreen()
    expect(screen.getByText("Andy Warhol")).toBeOnTheScreen()

    // and it works if onEndReached is called now
    fireEvent(screen.UNSAFE_getByType(InfiniteScrollFlashList), "onEndReached")
    expect(env.mock.getAllOperations()).toHaveLength(1)
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "AutosuggestResultsPaginationQuery"
    )
    expect(env.mock.getMostRecentOperation().request.variables.cursor).toBe("page-3")

    act(() => {
      env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage3 })
    })

    expect(screen.UNSAFE_queryAllByType(AutosuggestSearchResult)).toHaveLength(3)

    expect(screen.getByText("Andy Warhol")).toBeOnTheScreen()
    expect(screen.getByText("Alex Katz")).toBeOnTheScreen()
    expect(screen.getByText("Banksy")).toBeOnTheScreen()
  })

  it(`shows the loading spinner until there's no more data`, async () => {
    renderWithWrappers(<TestWrapper query="michael" />)
    act(() => env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage1 }))

    expect(screen.UNSAFE_getByType(Spinner)).toBeTruthy()

    fireEvent(screen.UNSAFE_getByType(InfiniteScrollFlashList), "onScrollBeginDrag")
    act(() => env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage2 }))

    expect(screen.UNSAFE_getByType(Spinner)).toBeTruthy()

    fireEvent(screen.UNSAFE_getByType(InfiniteScrollFlashList), "onEndReached")
    act(() => env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage3 }))

    expect(screen.UNSAFE_queryByType(Spinner)).toBeFalsy()
  })

  it(`gives an appropriate message when there's no search results`, () => {
    renderWithWrappers(<TestWrapper query="michael" />)
    act(() => env.mock.resolveMostRecentOperation({ errors: [], data: FixtureEmpty }))

    expect(screen.UNSAFE_queryByType(AutosuggestSearchResult)).toBeFalsy()
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

    fireEvent(screen.UNSAFE_getByType(AutosuggestSearchResult), "onResultPress")
    expect(spy).toHaveBeenCalled()
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

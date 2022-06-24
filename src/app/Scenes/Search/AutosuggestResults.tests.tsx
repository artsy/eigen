import { AutosuggestResultsPaginationQuery$rawResponse } from "__generated__/AutosuggestResultsPaginationQuery.graphql"
import { AutosuggestResultsQuery$rawResponse } from "__generated__/AutosuggestResultsQuery.graphql"
import { AboveTheFoldFlatList } from "app/Components/AboveTheFoldFlatList"
import Spinner from "app/Components/Spinner"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers, renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { CatchErrors } from "app/utils/CatchErrors"
import React from "react"
import { FlatList } from "react-native"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { AutosuggestResults } from "./AutosuggestResults"
import { AutosuggestSearchResult } from "./components/AutosuggestSearchResult"
import { SearchContext } from "./SearchContext"

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

jest.mock("lodash", () => ({
  ...jest.requireActual("lodash"),
  throttle: (f: any) => f,
}))

jest.unmock("react-relay")

// tslint:disable-next-line:no-empty
jest.mock("@sentry/react-native", () => ({ init() {}, captureMessage() {} }))

jest.mock("./RecentSearches", () => {
  const notifyRecentSearch = jest.fn()
  return {
    useRecentSearches() {
      return { notifyRecentSearch }
    },
  }
})

// tslint:disable-next-line:no-var-requires
const notifyRecentSearchMock = require("./RecentSearches").useRecentSearches().notifyRecentSearch

const env = defaultEnvironment as any as ReturnType<typeof createMockEnvironment>
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
  beforeEach(() => {
    env.mockClear()
    consoleErrorMock.mockClear()
    notifyRecentSearchMock.mockClear()
    inputBlurMock.mockClear()
  })

  afterEach(() => {
    expect(consoleErrorMock).not.toHaveBeenCalled()
  })

  it(`has no elements to begin with`, async () => {
    const tree = renderWithWrappers(<TestWrapper query="" />)
    expect(tree.root.findAllByType(AutosuggestSearchResult)).toHaveLength(0)
  })

  it(`has some elements to begin with if you give it some`, async () => {
    const tree = renderWithWrappers(<TestWrapper query="michael" />)
    expect(tree.root.findAllByType(AutosuggestSearchResult)).toHaveLength(0)

    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "AutosuggestResultsQuery"
    )
    expect(env.mock.getMostRecentOperation().request.variables.query).toBe("michael")

    act(() => {
      env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage1 })
    })

    expect(tree.root.findAllByType(AutosuggestSearchResult)).toHaveLength(1)
  })

  it(`doesn't call loadMore until you start scrolling`, () => {
    const tree = renderWithWrappers(<TestWrapper query="michael" />)
    act(() => {
      env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage1 })
    })
    expect(tree.root.findAllByType(AutosuggestSearchResult)).toHaveLength(1)

    expect(env.mock.getAllOperations()).toHaveLength(0)

    // even if AboveTheFoldFlatList calls onEndReached, we ignore it until the user explicitly scrolls
    act(() => {
      tree.root.findByType(AboveTheFoldFlatList).props.onEndReached()
    })
    expect(env.mock.getAllOperations()).toHaveLength(0)

    act(() => {
      tree.root.findByType(AboveTheFoldFlatList).props.onScrollBeginDrag()
    })
    expect(env.mock.getAllOperations()).toHaveLength(1)
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "AutosuggestResultsPaginationQuery"
    )
    expect(env.mock.getMostRecentOperation().request.variables.cursor).toBe("page-2")

    act(() => {
      env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage2 })
    })

    expect(tree.root.findAllByType(AutosuggestSearchResult)).toHaveLength(2)
    expect(extractText(tree.root)).toContain("Banksy")
    expect(extractText(tree.root)).toContain("Andy Warhol")

    // and it works if onEndReached is called now
    act(() => {
      tree.root.findByType(AboveTheFoldFlatList).props.onEndReached()
    })
    expect(env.mock.getAllOperations()).toHaveLength(1)
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "AutosuggestResultsPaginationQuery"
    )
    expect(env.mock.getMostRecentOperation().request.variables.cursor).toBe("page-3")

    act(() => {
      env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage3 })
    })

    expect(tree.root.findAllByType(AutosuggestSearchResult)).toHaveLength(3)
    expect(extractText(tree.root)).toContain("Banksy")
    expect(extractText(tree.root)).toContain("Andy Warhol")
    expect(extractText(tree.root)).toContain("Alex Katz")
  })

  it(`scrolls back to the top when the query changes`, async () => {
    const tree = renderWithWrappers(<TestWrapper query="michael" />)
    act(() => {
      env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage1 })
    })
    const scrollToOffsetMock = jest.fn()
    tree.root.findByType(AboveTheFoldFlatList).findByType(FlatList).instance.scrollToOffset =
      scrollToOffsetMock

    act(() => {
      tree.update(<TestWrapper query="michaela" />)
    })
    act(() => {
      env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage1 })
    })

    expect(scrollToOffsetMock).toHaveBeenCalledWith({ animated: true, offset: 0 })
  })

  it(`shows the loading spinner until there's no more data`, async () => {
    const tree = renderWithWrappers(<TestWrapper query="michael" />)
    act(() => env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage1 }))
    expect(tree.root.findAllByType(Spinner)).toHaveLength(1)

    act(() => tree.root.findByType(AboveTheFoldFlatList).props.onScrollBeginDrag())
    act(() => env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage2 }))

    expect(tree.root.findAllByType(Spinner)).toHaveLength(1)

    act(() => tree.root.findByType(AboveTheFoldFlatList).props.onEndReached())
    act(() => env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage3 }))

    expect(tree.root.findAllByType(Spinner)).toHaveLength(0)
  })

  it(`gives an appropriate message when there's no search results`, () => {
    const tree = renderWithWrappers(<TestWrapper query="michael" />)
    act(() => env.mock.resolveMostRecentOperation({ errors: [], data: FixtureEmpty }))

    expect(tree.root.findAllByType(AutosuggestSearchResult)).toHaveLength(0)
    expect(extractText(tree.root)).toContain("Sorry, we couldn’t find anything for “michael.”")
    expect(extractText(tree.root)).toContain(
      "Please try searching again with a different spelling."
    )
  })

  it(`optionally hides the result type`, () => {
    const tree = renderWithWrappers(<TestWrapper query="michael" showResultType={false} />)
    act(() => env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage1 }))
    expect(extractText(tree.root)).not.toContain("Artist")
  })

  it(`allows for custom touch handlers on search result items`, () => {
    const spy = jest.fn()
    const tree = renderWithWrappers(
      <TestWrapper query="michael" showResultType={false} onResultPress={spy} />
    )
    act(() => env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage1 }))
    tree.root.findByType(AutosuggestSearchResult).props.onResultPress()
    expect(spy).toHaveBeenCalled()
  })

  it("should show the loading placeholder ", () => {
    const { getByLabelText } = renderWithWrappersTL(<TestWrapper query="michael" />)

    expect(getByLabelText("Autosuggest results are loading")).toBeTruthy()
  })

  it("should hide the loading placeholder when results are received", () => {
    const { queryByLabelText } = renderWithWrappersTL(<TestWrapper query="michael" />)

    act(() => env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage1 }))

    expect(queryByLabelText("Autosuggest results are loading")).toBeFalsy()
  })

  it("should show the default error message", async () => {
    const { getByText } = renderWithWrappersTL(<TestWrapper query="michael" />)

    act(() => env.mock.rejectMostRecentOperation(new Error("Bad connection")))

    expect(
      getByText("There seems to be a problem with the connection. Please try again shortly.")
    ).toBeTruthy()
  })

  it("should show the unable to load error message when showOnRetryErrorMessage prop is true", () => {
    const { getByText } = renderWithWrappersTL(
      <TestWrapper query="michael" showOnRetryErrorMessage />
    )

    act(() => env.mock.rejectMostRecentOperation(new Error("Bad connection")))

    expect(getByText("Unable to load")).toBeTruthy()
  })
})

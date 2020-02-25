import { Theme } from "@artsy/palette"
import { AutosuggestResultsPaginationQueryRawResponse } from "__generated__/AutosuggestResultsPaginationQuery.graphql"
import { AutosuggestResultsQueryRawResponse } from "__generated__/AutosuggestResultsQuery.graphql"
import Spinner from "lib/Components/Spinner"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractText } from "lib/tests/extractText"
import { CatchErrors } from "lib/utils/CatchErrors"
import React from "react"
import { FlatList } from "react-native"
import ReactTestRenderer, { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { AutosuggestResults } from "../AutosuggestResults"
import { SearchContext } from "../SearchContext"
import { SearchResult } from "../SearchResult"

const FixturePage1: AutosuggestResultsQueryRawResponse = {
  results: {
    edges: [
      {
        cursor: "page-1",
        node: {
          __typename: "SearchableItem",
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
const FixturePage2: AutosuggestResultsPaginationQueryRawResponse = {
  results: {
    edges: [
      {
        cursor: "page-2",
        node: {
          __typename: "SearchableItem",
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

const FixturePage3: AutosuggestResultsPaginationQueryRawResponse = {
  results: {
    edges: [
      {
        cursor: "page-3",
        node: {
          __typename: "SearchableItem",
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

const FixtureEmpty: AutosuggestResultsQueryRawResponse = {
  results: {
    edges: [],
    pageInfo: {
      endCursor: null,
      hasNextPage: false,
    },
  },
}

const inputBlurMock = jest.fn()

const TestWrapper: typeof AutosuggestResults = props => (
  <SearchContext.Provider value={{ inputRef: { current: { blur: inputBlurMock } as any }, query: { current: "" } }}>
    <Theme>
      <CatchErrors>
        <AutosuggestResults {...props} />
      </CatchErrors>
    </Theme>
  </SearchContext.Provider>
)

jest.mock("lib/relay/createEnvironment", () => ({
  defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
}))

jest.mock("lodash", () => ({
  throttle: f => f,
}))

jest.unmock("react-relay")

// tslint:disable-next-line:no-empty
jest.mock("@sentry/react-native", () => ({ captureMessage() {} }))

jest.mock("lib/NativeModules/SwitchBoard", () => ({ presentNavigationViewController: jest.fn() }))

jest.mock("../RecentSearches", () => {
  const notifyRecentSearch = jest.fn()
  return {
    useRecentSearches() {
      return { notifyRecentSearch }
    },
  }
})

// tslint:disable-next-line:no-var-requires
const notifyRecentSearchMock = require("../RecentSearches").useRecentSearches().notifyRecentSearch

const env = defaultEnvironment as ReturnType<typeof createMockEnvironment>

const consoleErrorMock = jest.fn()
console.error = (...args: string[]) => {
  if (args[0].startsWith("Warning: An update to %s inside a test was not wrapped in act(...).")) {
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
    const tree = ReactTestRenderer.create(<TestWrapper query="" />)
    expect(tree.root.findAllByType(SearchResult)).toHaveLength(0)
  })

  it(`has some elements to begin with if you give it some`, async () => {
    const tree = ReactTestRenderer.create(<TestWrapper query="michael" />)
    expect(tree.root.findAllByType(SearchResult)).toHaveLength(0)

    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("AutosuggestResultsQuery")
    expect(env.mock.getMostRecentOperation().request.variables.query).toBe("michael")

    act(() => {
      env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage1 })
    })

    expect(tree.root.findAllByType(SearchResult)).toHaveLength(1)
  })

  it(`doesn't call loadMore untill you start scrolling`, () => {
    const tree = ReactTestRenderer.create(<TestWrapper query="michael" />)
    act(() => {
      env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage1 })
    })
    expect(tree.root.findAllByType(SearchResult)).toHaveLength(1)

    expect(env.mock.getAllOperations()).toHaveLength(0)

    // even if FlatList calls onEndReached, we ignore it until the user explicitly scrolls
    act(() => {
      tree.root.findByType(FlatList).props.onEndReached()
    })
    expect(env.mock.getAllOperations()).toHaveLength(0)

    act(() => {
      tree.root.findByType(FlatList).props.onScrollBeginDrag()
    })
    expect(env.mock.getAllOperations()).toHaveLength(1)
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("AutosuggestResultsPaginationQuery")
    expect(env.mock.getMostRecentOperation().request.variables.cursor).toBe("page-2")

    act(() => {
      env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage2 })
    })

    expect(tree.root.findAllByType(SearchResult)).toHaveLength(2)
    expect(extractText(tree.root)).toContain("Banksy")
    expect(extractText(tree.root)).toContain("Andy Warhol")

    // and it works if onEndReached is called now
    act(() => {
      tree.root.findByType(FlatList).props.onEndReached()
    })
    expect(env.mock.getAllOperations()).toHaveLength(1)
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("AutosuggestResultsPaginationQuery")
    expect(env.mock.getMostRecentOperation().request.variables.cursor).toBe("page-3")

    act(() => {
      env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage3 })
    })

    expect(tree.root.findAllByType(SearchResult)).toHaveLength(3)
    expect(extractText(tree.root)).toContain("Banksy")
    expect(extractText(tree.root)).toContain("Andy Warhol")
    expect(extractText(tree.root)).toContain("Alex Katz")
  })

  it(`scrolls back to the top when the query changes`, async () => {
    const tree = ReactTestRenderer.create(<TestWrapper query="michael" />)
    act(() => {
      env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage1 })
    })
    const scrollToOffsetMock = jest.fn()
    tree.root.findByType(FlatList).instance.scrollToOffset = scrollToOffsetMock

    act(() => {
      tree.update(<TestWrapper query="michaela" />)
    })
    act(() => {
      env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage1 })
    })

    expect(scrollToOffsetMock).toHaveBeenCalledWith({ animated: true, offset: 0 })
  })

  it(`shows the loading spinner until there's no more data`, async () => {
    const tree = ReactTestRenderer.create(<TestWrapper query="michael" />)
    act(() => env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage1 }))
    expect(tree.root.findAllByType(Spinner)).toHaveLength(1)

    act(() => tree.root.findByType(FlatList).props.onScrollBeginDrag())
    act(() => env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage2 }))

    expect(tree.root.findAllByType(Spinner)).toHaveLength(1)

    act(() => tree.root.findByType(FlatList).props.onEndReached())
    act(() => env.mock.resolveMostRecentOperation({ errors: [], data: FixturePage3 }))

    expect(tree.root.findAllByType(Spinner)).toHaveLength(0)
  })

  it(`gives an appropriate message when there's no search results`, () => {
    const tree = ReactTestRenderer.create(<TestWrapper query="michael" />)
    act(() => env.mock.resolveMostRecentOperation({ errors: [], data: FixtureEmpty }))

    expect(tree.root.findAllByType(SearchResult)).toHaveLength(0)
    expect(extractText(tree.root)).toContain("We couldn't find anything for “michael”")
  })
})

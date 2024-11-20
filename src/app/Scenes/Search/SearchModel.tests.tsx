import { __globalStoreTestUtils__, GlobalStore, GlobalStoreProvider } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { times } from "lodash"
import {
  MAX_SAVED_RECENT_SEARCHES,
  RecentSearch,
  SearchModel,
  useRecentSearches,
} from "./SearchModel"

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

const andyWarhol: RecentSearch = {
  type: "AUTOSUGGEST_RESULT_TAPPED",
  props: {
    displayLabel: "Andy Warhol",
    displayType: "Artist",
    href: "https://artsy.com/artist/andy-warhol",
    imageUrl: "https://org-name.my-cloud-provider.com/bucket-hash/content-hash.jpg",
    __typename: "Artist",
  },
}

describe("Recent Searches", () => {
  const getRecentSearches = () => __globalStoreTestUtils__?.getCurrentState().search.recentSearches!
  beforeEach(async () => {
    __globalStoreTestUtils__?.reset()
  })

  it("Starts out with an empty array", () => {
    expect(getRecentSearches()).toEqual([])
  })

  it("Saves added Recent Search", () => {
    GlobalStore.actions.search.addRecentSearch(banksy)
    expect(getRecentSearches()).toEqual([banksy])
  })

  it("puts the most recent items at the top", async () => {
    GlobalStore.actions.search.addRecentSearch(banksy)
    GlobalStore.actions.search.addRecentSearch(andyWarhol)

    expect(getRecentSearches()).toEqual([andyWarhol, banksy])
  })

  it("reorders items if they get reused", async () => {
    GlobalStore.actions.search.addRecentSearch(banksy)
    GlobalStore.actions.search.addRecentSearch(andyWarhol)

    // reorder
    GlobalStore.actions.search.addRecentSearch(banksy)
    expect(getRecentSearches()).toEqual([banksy, andyWarhol])

    // reorder again
    GlobalStore.actions.search.addRecentSearch(andyWarhol)
    expect(getRecentSearches()).toEqual([andyWarhol, banksy])
  })

  it(`stores a max of ${MAX_SAVED_RECENT_SEARCHES} recent searches`, async () => {
    // act
    for (let i = 0; i < MAX_SAVED_RECENT_SEARCHES * 5; i++) {
      GlobalStore.actions.search.addRecentSearch({
        type: "AUTOSUGGEST_RESULT_TAPPED",
        props: {
          href: `https://example.com/${i}`,
          imageUrl: "",
          displayLabel: "",
          displayType: "",
          __typename: "",
        },
      })
    }

    expect(getRecentSearches().length).toBe(MAX_SAVED_RECENT_SEARCHES)
  })

  it(`allows deleting things`, async () => {
    // act
    GlobalStore.actions.search.addRecentSearch(banksy)
    GlobalStore.actions.search.addRecentSearch(andyWarhol)
    GlobalStore.actions.search.deleteRecentSearch(andyWarhol.props)
    expect(getRecentSearches()).toEqual([banksy])
  })
})

describe(useRecentSearches, () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({
      AREnableNewSearchModal: true,
    })
  })

  it("truncates the list of recent searches", async () => {
    let localRecentSearches: SearchModel["recentSearches"] = []
    let globalRecentSearches: SearchModel["recentSearches"] = []
    const TestComponent: React.FC<{ numSearches: number }> = ({ numSearches }) => {
      localRecentSearches = useRecentSearches(numSearches)
      globalRecentSearches = __globalStoreTestUtils__?.getCurrentState().search.recentSearches!

      return null
    }

    const tree = renderWithWrappersLEGACY(
      <GlobalStoreProvider>
        <TestComponent numSearches={5} />
      </GlobalStoreProvider>
    )

    expect(localRecentSearches.length).toBe(0)
    expect(globalRecentSearches.length).toBe(0)

    times(10).forEach((i) => {
      GlobalStore.actions.search.addRecentSearch({
        type: "AUTOSUGGEST_RESULT_TAPPED",
        props: {
          href: `https://example.com/${i}`,
          imageUrl: "",
          displayLabel: "",
          displayType: "",
          __typename: "",
        },
      })
    })

    await flushPromiseQueue()

    expect(localRecentSearches.length).toBe(10)
    expect(globalRecentSearches.length).toBe(10)

    tree.update(
      <GlobalStoreProvider>
        <TestComponent numSearches={8} />
      </GlobalStoreProvider>
    )

    await flushPromiseQueue()

    expect(localRecentSearches.length).toBe(10)
    expect(globalRecentSearches.length).toBe(10)
  })
})

import { extractText } from "lib/tests/extractText"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import React, { MutableRefObject } from "react"
import { Text, View } from "react-native"
import { act, create, ReactTestRenderer } from "react-test-renderer"
import {
  getRecentSearches,
  MAX_SAVED_RECENT_SEARCHES,
  MAX_SHOWN_RECENT_SEARCHES,
  RecentSearch,
  RecentSearchContext,
} from "../RecentSearches"

const banksy: RecentSearch = {
  type: "AUTOSUGGEST_RESULT_TAPPED",
  props: {
    displayLabel: "Banksy",
    displayType: "Artist",
    href: "https://artsy.com/artist/banksy",
    imageUrl: "https://org-name.my-cloud-provider.com/bucket-hash/content-hash.jpg",
  },
}

const andyWarhol: RecentSearch = {
  type: "AUTOSUGGEST_RESULT_TAPPED",
  props: {
    displayLabel: "Andy Warhol",
    displayType: "Artist",
    href: "https://artsy.com/artist/andy-warhol",
    imageUrl: "https://org-name.my-cloud-provider.com/bucket-hash/content-hash.jpg",
  },
}

const TestItem: React.FC<{ href: string; onPress(): void }> = ({ href }) => {
  return <Text>{href}</Text>
}

type TestRef = MutableRefObject<{
  recentSearches: RecentSearch[]
  deleteRecentSearch(searchProps: RecentSearch["props"]): void
  addRecentSearch(search: RecentSearch): void
}>

const _TestPage: React.FC<{ testRef: TestRef; numItems?: number }> = ({
  testRef = { current: null },
  numItems = MAX_SHOWN_RECENT_SEARCHES,
}) => {
  // const RecentSearchContext = createContextStore(persist(recentSearchesModel, { storage }))
  const recentSearches = RecentSearchContext.useStoreState(state => state.recentSearches)
  const addRecentSearch = RecentSearchContext.useStoreActions(actions => actions.addRecentSearch)
  const deleteRecentSearch = RecentSearchContext.useStoreActions(actions => actions.deleteRecentSearch)

  testRef.current = { recentSearches, addRecentSearch, deleteRecentSearch }

  const shownRecentSearches = getRecentSearches(recentSearches, numItems)
  return (
    <View>
      {shownRecentSearches.map(({ props }) => (
        <TestItem
          href={props.href! /* STRICTNESS_MIGRATION */}
          onPress={() => addRecentSearch({ type: "AUTOSUGGEST_RESULT_TAPPED", props })}
        />
      ))}
    </View>
  )
}

const TestPage: typeof _TestPage = props => {
  return (
    <RecentSearchContext.Provider>
      <_TestPage {...props} />
    </RecentSearchContext.Provider>
  )
}

describe("Recent Searches", () => {
  // @ts-ignore STRICTNESS_MIGRATION
  const testRef: TestRef = { current: null }
  // @ts-ignore STRICTNESS_MIGRATION
  let tree: ReactTestRenderer = null

  async function remountTree(jsx?: JSX.Element) {
    if (tree) {
      tree.unmount()
    }
    act(() => {
      tree = create(jsx || <TestPage testRef={testRef} />)
    })
    await flushPromiseQueue()
  }

  beforeEach(async () => {
    require("@react-native-community/async-storage").__resetState()
    await remountTree()
  })

  it("Starts out with an empty array", () => {
    // assert
    expect(testRef.current.recentSearches).toEqual([])
  })

  it("Saves added Recent Search", () => {
    // act
    testRef.current.addRecentSearch(banksy)
    // assert
    expect(testRef.current.recentSearches).toEqual([banksy])
    // should still be length 0 because local state doesn't update
    expect(tree.root.findAllByType(TestItem)).toHaveLength(1)
    expect(tree.root.findAllByType(TestItem)[0].props.href).toBe(banksy.props.href)
  })

  it("puts the most recent items at the top", async () => {
    // act
    testRef.current.addRecentSearch(banksy)
    testRef.current.addRecentSearch(andyWarhol)

    // assert
    expect(tree.root.findAllByType(TestItem)).toHaveLength(2)
    expect(tree.root.findAllByType(TestItem)[0].props.href).toBe(andyWarhol.props.href)
    expect(tree.root.findAllByType(TestItem)[1].props.href).toBe(banksy.props.href)
  })

  it("reorders items if they get reused", async () => {
    // act
    testRef.current.addRecentSearch(banksy)
    testRef.current.addRecentSearch(andyWarhol)

    // reorder
    testRef.current.addRecentSearch(banksy)

    // assert
    expect(tree.root.findAllByType(TestItem)).toHaveLength(2)
    expect(tree.root.findAllByType(TestItem)[0].props.href).toBe(banksy.props.href)
    expect(tree.root.findAllByType(TestItem)[1].props.href).toBe(andyWarhol.props.href)

    // reorder again
    tree.root.findAllByType(TestItem)[1].props.onPress()

    // assert
    expect(tree.root.findAllByType(TestItem)[0].props.href).toBe(andyWarhol.props.href)
    expect(tree.root.findAllByType(TestItem)[1].props.href).toBe(banksy.props.href)
  })

  it(`shows a max of ${MAX_SHOWN_RECENT_SEARCHES} recent searches`, async () => {
    // act
    for (let i = 0; i < 200; i++) {
      testRef.current.addRecentSearch({
        type: "AUTOSUGGEST_RESULT_TAPPED",
        props: {
          href: `https://example.com/${i}`,
          imageUrl: "",
          displayLabel: "",
          displayType: "",
        },
      })
    }

    // assert
    expect(tree.root.findAllByType(TestItem)).toHaveLength(MAX_SHOWN_RECENT_SEARCHES)
  })

  it(`saves a max of ${MAX_SAVED_RECENT_SEARCHES} recent searches`, async () => {
    // act
    for (let i = 0; i < 200; i++) {
      testRef.current.addRecentSearch({
        type: "AUTOSUGGEST_RESULT_TAPPED",
        props: {
          href: `https://example.com/${i}`,
          imageUrl: "",
          displayLabel: "",
          displayType: "",
        },
      })
    }

    // assert
    expect(testRef.current.recentSearches.length).toEqual(MAX_SAVED_RECENT_SEARCHES)
  })

  it(`allows deleting things`, async () => {
    // act
    testRef.current.addRecentSearch(banksy)
    testRef.current.addRecentSearch(andyWarhol)
    testRef.current.deleteRecentSearch(andyWarhol.props)

    // assert
    expect(tree.root.findAllByType(TestItem)).toHaveLength(1)
    expect(extractText(tree.root)).not.toContain("andy-warhol")
  })
})

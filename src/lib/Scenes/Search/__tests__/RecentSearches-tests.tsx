import { __appStoreTestUtils__, AppStore, AppStoreProvider } from "lib/store/AppStore"
import { extractText } from "lib/tests/extractText"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import React, { MutableRefObject } from "react"
import { Text, View } from "react-native"
import { act, create, ReactTestRenderer } from "react-test-renderer"
import { MAX_SAVED_RECENT_SEARCHES, MAX_SHOWN_RECENT_SEARCHES, RecentSearch, useRecentSearches } from "../SearchModel"

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

type TestRef = MutableRefObject<RecentSearch[]>

const _TestPage: React.FC<{ testRef: TestRef; numItems?: number }> = ({ testRef = { current: null } }) => {
  const recentSearches = useRecentSearches()

  testRef.current = recentSearches

  return (
    <View>
      {recentSearches.map(({ props }) => (
        <TestItem
          href={props.href! /* STRICTNESS_MIGRATION */}
          onPress={() => AppStore.actions.search.addRecentSearch({ type: "AUTOSUGGEST_RESULT_TAPPED", props })}
        />
      ))}
    </View>
  )
}

const TestPage: typeof _TestPage = props => {
  return (
    <AppStoreProvider>
      <_TestPage {...props} />
    </AppStoreProvider>
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
    expect(testRef.current).toEqual([])
  })

  it("Saves added Recent Search", () => {
    // act
    AppStore.actions.search.addRecentSearch(banksy)
    // assert
    expect(testRef.current).toEqual([banksy])
    // should still be length 0 because local state doesn't update
    expect(tree.root.findAllByType(TestItem)).toHaveLength(1)
    expect(tree.root.findAllByType(TestItem)[0].props.href).toBe(banksy.props.href)
  })

  it("puts the most recent items at the top", async () => {
    // act
    AppStore.actions.search.addRecentSearch(banksy)
    AppStore.actions.search.addRecentSearch(andyWarhol)

    // assert
    expect(tree.root.findAllByType(TestItem)).toHaveLength(2)
    expect(tree.root.findAllByType(TestItem)[0].props.href).toBe(andyWarhol.props.href)
    expect(tree.root.findAllByType(TestItem)[1].props.href).toBe(banksy.props.href)
  })

  it("reorders items if they get reused", async () => {
    // act
    AppStore.actions.search.addRecentSearch(banksy)
    AppStore.actions.search.addRecentSearch(andyWarhol)

    // reorder
    AppStore.actions.search.addRecentSearch(banksy)

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
      AppStore.actions.search.addRecentSearch({
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
    for (let i = 0; i < MAX_SAVED_RECENT_SEARCHES * 3; i++) {
      AppStore.actions.search.addRecentSearch({
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
    expect(__appStoreTestUtils__?.getCurrentState().search.recentSearches.length).toEqual(MAX_SAVED_RECENT_SEARCHES)
  })

  it(`allows deleting things`, async () => {
    // act
    AppStore.actions.search.addRecentSearch(banksy)
    AppStore.actions.search.addRecentSearch(andyWarhol)
    AppStore.actions.search.deleteRecentSearch(andyWarhol.props)

    // assert
    expect(tree.root.findAllByType(TestItem)).toHaveLength(1)
    expect(extractText(tree.root)).not.toContain("andy-warhol")
  })
})

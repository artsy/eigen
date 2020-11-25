import { EntityType, navigate, navigateToEntity, SlugType } from "lib/navigation/navigate"
import { GlobalStore, GlobalStoreProvider } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { CatchErrors } from "lib/utils/CatchErrors"
import { CloseIcon } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { act } from "react-test-renderer"
import { SearchContext } from "../SearchContext"
import { SearchResult } from "../SearchResult"

const inputBlurMock = jest.fn()

const result = {
  displayLabel: "Banksy",
  href: "banksy-href",
  imageUrl: "blah",
  displayType: "Artist",
}

let recentSearchesArray: any[] = []

const _TestWrapper: typeof SearchResult = (props) => {
  const recentSearches = GlobalStore.useAppState((state) => state.search.recentSearches)

  recentSearchesArray = recentSearches
  return <SearchResult {...props} />
}

const TestWrapper: typeof SearchResult = (props) => (
  <GlobalStoreProvider>
    <SearchContext.Provider
      value={{ inputRef: { current: { blur: inputBlurMock } as any }, queryRef: { current: "" } }}
    >
      <CatchErrors>
        <_TestWrapper {...props} />
      </CatchErrors>
    </SearchContext.Provider>
  </GlobalStoreProvider>
)

describe(SearchResult, () => {
  beforeEach(() => {
    require("@react-native-community/async-storage").__resetState()
    recentSearchesArray = []
    inputBlurMock.mockClear()
  })
  it(`works`, async () => {
    const tree = renderWithWrappers(<TestWrapper result={result} />)

    expect(extractText(tree.root)).toContain("Banksy")
    expect(extractText(tree.root)).toContain("Artist")
  })

  it("has an optional onDelete action which shows a close button", () => {
    const tree = renderWithWrappers(<TestWrapper result={result} />)
    expect(tree.root.findAllByType(CloseIcon)).toHaveLength(0)
    act(() => {
      tree.update(<TestWrapper result={result} onDelete={() => void 0} />)
    })
    expect(tree.root.findAllByType(CloseIcon)).toHaveLength(1)
  })

  it("blurs the input and navigates to the correct page when tapped", async () => {
    const tree = renderWithWrappers(<TestWrapper result={result} />)
    expect(navigate).not.toHaveBeenCalled()
    tree.root.findByType(TouchableOpacity).props.onPress()
    await new Promise((r) => setTimeout(r, 50))
    expect(inputBlurMock).toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledWith(result.href)
  })

  it(`highlights a part of the string if possible`, async () => {
    const tree = renderWithWrappers(<TestWrapper result={result} highlight="an" />)

    expect(extractText(tree.root.findByProps({ weight: "medium" }))).toBe("an")
  })

  it(`highlights a part of the string even when the string has diacritics but the highlight doesn't`, async () => {
    const tree = renderWithWrappers(
      <TestWrapper
        result={{
          ...result,
          displayLabel: "Joãn Miró",
        }}
        highlight="an"
      />
    )

    expect(extractText(tree.root.findByProps({ weight: "medium" }))).toBe("ãn")

    tree.update(
      <TestWrapper
        result={{
          ...result,
          displayLabel: "Joãn Miró",
        }}
        highlight="Miro"
      />
    )

    expect(extractText(tree.root.findByProps({ weight: "medium" }))).toBe("Miró")
  })

  it(`updates recent searches by default`, async () => {
    const tree = renderWithWrappers(<TestWrapper result={result} />)
    expect(navigate).not.toHaveBeenCalled()
    expect(recentSearchesArray).toHaveLength(0)
    act(() => {
      tree.root.findByType(TouchableOpacity).props.onPress()
    })
    await new Promise((r) => setTimeout(r, 50))
    expect(recentSearchesArray).toHaveLength(1)
  })

  it(`won't update recent searches if told not to`, async () => {
    const tree = renderWithWrappers(<TestWrapper result={result} updateRecentSearchesOnTap={false} />)
    expect(navigate).not.toHaveBeenCalled()
    expect(recentSearchesArray).toHaveLength(0)
    act(() => {
      tree.root.findByType(TouchableOpacity).props.onPress()
    })
    await new Promise((r) => setTimeout(r, 50))
    expect(recentSearchesArray).toHaveLength(0)
  })

  it(`optionally hides the entity type`, () => {
    const tree = renderWithWrappers(<TestWrapper result={result} showResultType={false} />)
    expect(extractText(tree.root)).not.toContain("Artist")
  })

  it(`allows for custom touch handlers on search result items`, () => {
    const spy = jest.fn()
    const tree = renderWithWrappers(<TestWrapper result={result} onResultPress={spy} />)
    tree.root.findByType(TouchableOpacity).props.onPress()
    expect(spy).toHaveBeenCalled()
  })

  it(`navigates correctly when the item is a fair`, async () => {
    const tree = renderWithWrappers(
      <TestWrapper
        result={{
          displayLabel: "Art Expo 2020",
          href: "/art-expo-diff-profile-slug",
          slug: "art-expo-profile-slug",
          imageUrl: "blah",
          displayType: "Fair",
        }}
      />
    )
    act(() => {
      tree.root.findByType(TouchableOpacity).props.onPress()
    })
    await new Promise((r) => setTimeout(r, 50))
    expect(navigateToEntity).toHaveBeenCalledWith("/art-expo-diff-profile-slug", EntityType.Fair, SlugType.ProfileID)
  })
})

import { EntityType, navigate, navigateToEntity, SlugType } from "lib/navigation/navigate"
import { SearchListItem } from "lib/Scenes/Search2/components/SearchListItem"
import { GlobalStore, GlobalStoreProvider } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { CatchErrors } from "lib/utils/CatchErrors"
import { CloseIcon, Touchable } from "palette"
import React from "react"
import { Pressable } from "react-native"
import { act } from "react-test-renderer"
import { AutosuggestSearchResult } from "../AutosuggestSearchResult"
import { ItalicText, ResultWithItalic, Text } from "../ResultWithHighlight"
import { SearchContext } from "../SearchContext"

const inputBlurMock = jest.fn()

const result = {
  displayLabel: "Banksy",
  href: "banksy-href",
  imageUrl: "blah",
  displayType: "Artist",
  __typename: "Artist",
}

let recentSearchesArray: any[] = []

const _TestWrapper: typeof AutosuggestSearchResult = (props) => {
  const recentSearches = GlobalStore.useAppState((state) => state.search.recentSearches)

  recentSearchesArray = recentSearches
  return <AutosuggestSearchResult {...props} />
}

const TestWrapper: typeof AutosuggestSearchResult = (props) => (
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

describe(AutosuggestSearchResult, () => {
  beforeEach(() => {
    require("@react-native-community/async-storage").__resetState()
    recentSearchesArray = []
    inputBlurMock.mockClear()
  })
  it(`works`, async () => {
    const tree = renderWithWrappers(<TestWrapper result={result} showResultType={true} />)

    expect(extractText(tree.root)).toContain("Banksy")
    expect(extractText(tree.root)).toContain("Artist")
  })

  it("renders SearchListItem and passing correct props to it", async () => {
    const tree = renderWithWrappers(<TestWrapper result={result} onDelete={jest.fn()} />)

    const searchListItem = tree.root.findByType(SearchListItem)
    const searchListItemProps = searchListItem.props

    expect(searchListItem).toBeDefined()
    expect(searchListItemProps.categoryName).toEqual("Artist")
    expect(searchListItemProps.imageURL).toEqual("blah")
    expect(searchListItemProps.onPress).toBeDefined()
    expect(searchListItemProps.onDelete).toBeDefined()
  })

  it("rensders children passed to SearchListItem", async () => {
    const tree = renderWithWrappers(<TestWrapper result={result} showResultType={true} />)
    const searchListItemText = extractText(tree.root.findByType(SearchListItem))

    expect(searchListItemText).toContain("Banksy")
    expect(searchListItemText).toContain("Artist")
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
    tree.root.findByType(Touchable).props.onPress()
    await new Promise((r) => setTimeout(r, 50))
    expect(inputBlurMock).toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledWith(result.href, { passProps: { initialTab: "Artworks" } })
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
      tree.root.findByType(Touchable).props.onPress()
    })
    await new Promise((r) => setTimeout(r, 50))
    expect(recentSearchesArray).toHaveLength(1)
  })

  it(`won't update recent searches if told not to`, async () => {
    const tree = renderWithWrappers(<TestWrapper result={result} updateRecentSearchesOnTap={false} />)
    expect(navigate).not.toHaveBeenCalled()
    expect(recentSearchesArray).toHaveLength(0)
    act(() => {
      tree.root.findByType(Touchable).props.onPress()
    })
    await new Promise((r) => setTimeout(r, 50))
    expect(recentSearchesArray).toHaveLength(0)
  })

  it(`optionally hides the entity type`, () => {
    const tree = renderWithWrappers(<TestWrapper result={result} />)
    expect(extractText(tree.root)).not.toContain("Artist")
  })

  it(`allows for custom touch handlers on search result items`, () => {
    const spy = jest.fn()
    const tree = renderWithWrappers(<TestWrapper result={result} onResultPress={spy} />)
    tree.root.findByType(Touchable).props.onPress()
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
          __typename: "SearchableItem",
        }}
      />
    )
    act(() => {
      tree.root.findByType(Touchable).props.onPress()
    })
    await new Promise((r) => setTimeout(r, 50))
    expect(navigateToEntity).toHaveBeenCalledWith("/art-expo-diff-profile-slug", EntityType.Fair, SlugType.ProfileID)
  })

  it(`shows navigation buttons when enabled and available`, async () => {
    const tree = renderWithWrappers(
      <TestWrapper
        result={{
          displayLabel: "Banksy",
          href: "/artist/anto-carte",
          imageUrl: "blah",
          __typename: "Artist",
          counts: {
            artworks: 12,
            auctionResults: 4,
          },
        }}
        showQuickNavigationButtons
      />
    )

    expect(extractText(tree.root)).toContain("Auction Results")
    expect(extractText(tree.root)).toContain("Artworks")
  })

  it(`does not show navigation buttons when disabled`, async () => {
    const tree = renderWithWrappers(
      <TestWrapper
        result={{
          displayLabel: "Banksy",
          href: "/artist/anto-carte",
          imageUrl: "blah",
          __typename: "Artist",
          counts: {
            artworks: 12,
            auctionResults: 4,
          },
        }}
        showQuickNavigationButtons={false}
      />
    )

    expect(extractText(tree.root)).not.toContain("Auction Results")
    expect(extractText(tree.root)).not.toContain("Artworks")
  })

  it(`does not show navigation buttons when enabled, but unavailable`, async () => {
    const tree = renderWithWrappers(
      <TestWrapper
        result={{
          displayLabel: "Banksy",
          href: "/artist/anto-carte",
          imageUrl: "blah",
          __typename: "Artist",
          counts: {
            artworks: 12,
            auctionResults: 0,
          },
        }}
        showQuickNavigationButtons
      />
    )

    expect(extractText(tree.root)).not.toContain("Auction Results")
    expect(extractText(tree.root)).not.toContain("Artworks")
  })

  it(`quick navigation buttons navigate correctly`, async () => {
    const tree = renderWithWrappers(
      <TestWrapper
        result={{
          displayLabel: "Banksy",
          href: "/artist/anto-carte",
          imageUrl: "blah",
          __typename: "Artist",
          counts: {
            artworks: 12,
            auctionResults: 4,
          },
        }}
        showQuickNavigationButtons
      />
    )

    act(() => {
      tree.root.findAllByType(Pressable)[0].props.onPress()
    })
    await new Promise((r) => setTimeout(r, 50))
    expect(navigate).toHaveBeenCalledWith("/artist/anto-carte", { passProps: { initialTab: "Artworks" } })

    act(() => {
      tree.root.findAllByType(Pressable)[1].props.onPress()
    })
    await new Promise((r) => setTimeout(r, 50))
    expect(navigate).toHaveBeenCalledWith("/artist/anto-carte", { passProps: { initialTab: "Insights" } })
  })
})

describe("ResultWithItalic", () => {
  describe("when match is in an artwork name", () => {
    const array = ["Henri Venne, The Sun Shines ", "Cold", " (2015)"]
    const tree = renderWithWrappers(<ResultWithItalic result={array} />)
    const text = tree.root.findAllByType(Text)
    const italicText = tree.root.findAllByType(ItalicText)

    it("renders 3 text elements", () => {
      expect(text).toHaveLength(3)
    })

    it(`renders "Henri Venne" as plain text`, () => {
      expect(text[0].props.italic).toBeFalsy()
      expect(extractText(text[0])).toEqual("Henri Venne")
    })

    it("renders 2 italic text elements", () => {
      expect(italicText).toHaveLength(2)
    })

    it(`renders "The Sun Shines " and " (2015)" as italic grey text elements`, () => {
      expect(italicText[0].props.color).toBeUndefined()
      expect(extractText(italicText[0])).toContain("The Sun Shines ")
      expect(extractText(italicText[0])).toContain(" (2015)")
    })

    it(`renders "Cold" as italic blue text element`, () => {
      expect(italicText[1].props.color).toEqual("blue100")
      expect(extractText(italicText[1])).toContain("Cold")
    })
  })

  describe("when match is in an artist name", () => {
    const array = ["Christ on the ", "Cold", " Stone, Title, with comma (1990)"]
    const tree = renderWithWrappers(<ResultWithItalic result={array} />)
    const text = tree.root.findAllByType(Text)
    const italicText = tree.root.findAllByType(ItalicText)

    it("renders 3 text elements", () => {
      expect(text).toHaveLength(3)
    })

    it(`renders "Christ on the " and " Stone" as plain text element`, () => {
      expect(text[0].props.italic).toBeFalsy()
      expect(extractText(text[0])).toContain("Christ on the ")
      expect(extractText(text[0])).toContain(" Stone")
    })

    it(`renders "Cold" as bold blue text element`, () => {
      expect(text[1].props.weight).toEqual("medium")
      expect(text[1].props.color).toEqual("blue100")
      expect(extractText(text[1])).toEqual("Cold")
    })

    it(`renders " Title, with comma (1990)" as italic grey text element`, () => {
      expect(italicText).toHaveLength(1)
      expect(italicText[0].props.color).toBeUndefined()
      expect(extractText(italicText[0])).toEqual(" Title, with comma (1990)")
    })
  })

  describe("when there is no artwork name", () => {
    const array = ["Ann ", "Veronica", " Janssens"]
    const tree = renderWithWrappers(<ResultWithItalic result={array} />)
    const text = tree.root.findAllByType(Text)

    it("renders 2 text elements", () => {
      expect(text).toHaveLength(2)
    })

    it(`renders "Ann " and " Janssens" as plain text elements`, () => {
      expect(text[0].props.italic).toBeFalsy()
      expect(extractText(text[0])).toContain("Ann ")
      expect(extractText(text[0])).toContain(" Janssens")
    })

    it(`renders "Veronica" as bold blue text element`, () => {
      expect(text[1].props.weight).toEqual("medium")
      expect(text[1].props.color).toEqual("blue100")
      expect(extractText(text[1])).toEqual("Veronica")
    })
  })
})

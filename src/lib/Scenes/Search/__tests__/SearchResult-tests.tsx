import { CloseIcon, Theme } from "@artsy/palette"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { extractText } from "lib/tests/extractText"
import { CatchErrors } from "lib/utils/CatchErrors"
import React from "react"
import { TouchableOpacity } from "react-native"
import { act, create } from "react-test-renderer"
import { ProvideRecentSearches, useRecentSearches } from "../RecentSearches"
import { SearchContext } from "../SearchContext"
import { SearchResult } from "../SearchResult"

const inputBlurMock = jest.fn()

const result = {
  displayLabel: "Banksy",
  href: "banksy-href",
  imageUrl: "blah",
  displayType: "Artist",
}

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

let recentSearchesArray: any[] = []

const _TestWrapper: typeof SearchResult = props => {
  const { recentSearches } = useRecentSearches()
  recentSearchesArray = recentSearches
  return <SearchResult {...props} />
}

const TestWrapper: typeof SearchResult = props => (
  <SearchContext.Provider value={{ inputRef: { current: { blur: inputBlurMock } as any }, query: { current: "" } }}>
    <ProvideRecentSearches>
      <Theme>
        <CatchErrors>
          <_TestWrapper {...props} />
        </CatchErrors>
      </Theme>
    </ProvideRecentSearches>
  </SearchContext.Provider>
)

describe(SearchResult, () => {
  beforeEach(() => {
    require("@react-native-community/async-storage").__resetState()
    recentSearchesArray = []
    inputBlurMock.mockClear()
    // @ts-ignore
    SwitchBoard.presentNavigationViewController.mockClear()
  })
  it(`works`, async () => {
    const tree = create(<TestWrapper result={result} />)

    expect(extractText(tree.root)).toContain("Banksy")
    expect(extractText(tree.root)).toContain("Artist")
  })

  it("has an optional onDelete action which shows a close button", () => {
    const tree = create(<TestWrapper result={result} />)
    expect(tree.root.findAllByType(CloseIcon)).toHaveLength(0)
    act(() => {
      tree.update(<TestWrapper result={result} onDelete={() => void 0} />)
    })
    expect(tree.root.findAllByType(CloseIcon)).toHaveLength(1)
  })

  it("blurs the input and navigates to the correct page when tapped", async () => {
    const tree = create(<TestWrapper result={result} />)
    expect(SwitchBoard.presentNavigationViewController).not.toHaveBeenCalled()
    tree.root.findByType(TouchableOpacity).props.onPress()
    await new Promise(r => setTimeout(r, 50))
    expect(inputBlurMock).toHaveBeenCalled()
    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(expect.anything(), result.href)
  })

  it(`highlights a part of the string if possible`, async () => {
    const tree = create(<TestWrapper result={result} highlight="an" />)

    expect(extractText(tree.root.findByProps({ weight: "semibold" }))).toBe("an")
  })

  it(`highlights a part of the string even when the string has diacritics but the highlight doesn't`, async () => {
    const tree = create(
      <TestWrapper
        result={{
          ...result,
          displayLabel: "Joãn Miró",
        }}
        highlight="an"
      />
    )

    expect(extractText(tree.root.findByProps({ weight: "semibold" }))).toBe("ãn")

    tree.update(
      <TestWrapper
        result={{
          ...result,
          displayLabel: "Joãn Miró",
        }}
        highlight="Miro"
      />
    )

    expect(extractText(tree.root.findByProps({ weight: "semibold" }))).toBe("Miró")
  })

  it(`updates recent searches by default`, async () => {
    const tree = create(<TestWrapper result={result} />)
    expect(SwitchBoard.presentNavigationViewController).not.toHaveBeenCalled()
    expect(recentSearchesArray).toHaveLength(0)
    act(() => {
      tree.root.findByType(TouchableOpacity).props.onPress()
    })
    await new Promise(r => setTimeout(r, 50))
    expect(recentSearchesArray).toHaveLength(1)
  })

  it(`won't update recent searches if told not to`, async () => {
    const tree = create(<TestWrapper result={result} updateRecentSearchesOnTap={false} />)
    expect(SwitchBoard.presentNavigationViewController).not.toHaveBeenCalled()
    expect(recentSearchesArray).toHaveLength(0)
    act(() => {
      tree.root.findByType(TouchableOpacity).props.onPress()
    })
    await new Promise(r => setTimeout(r, 50))
    expect(recentSearchesArray).toHaveLength(0)
  })
})

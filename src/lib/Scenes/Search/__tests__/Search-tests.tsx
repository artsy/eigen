import { Theme } from "@artsy/palette"
import { __appStoreTestUtils__, AppStoreProvider } from "lib/store/AppStore"
import { extractText } from "lib/tests/extractText"
import { isPad } from "lib/utils/hardware"
import React from "react"
import { TextInput } from "react-native"
import { act } from "react-test-renderer"
import { CatchErrors } from "../../../utils/CatchErrors"
import { AutosuggestResults } from "../AutosuggestResults"
import { CityGuideCTA } from "../CityGuideCTA"
import { RecentSearches } from "../RecentSearches"
import { Search } from "../Search"
import { RecentSearch } from "../SearchModel"

const banksy: RecentSearch = {
  type: "AUTOSUGGEST_RESULT_TAPPED",
  props: {
    displayLabel: "Banksy",
    displayType: "Artist",
    href: "https://artsy.com/artist/banksy",
    imageUrl: "https://org-name.my-cloud-provider.com/bucket-hash/content-hash.jpg",
  },
}

jest.mock("lib/utils/hardware", () => ({
  isPad: jest.fn(),
}))
import { renderWithWrappers } from "lib/tests/renderWithWrappers"

jest.mock("../AutosuggestResults", () => ({ AutosuggestResults: () => null }))
jest.mock("../RecentSearches", () => ({
  RecentSearches: () => null,
  ProvideRecentSearches: ({ children }: any) => children,
  RecentSearchContext: {
    useStoreState: () => [],
  },
  getRecentSearches: jest.fn(() => []),
}))

const TestWrapper: typeof Search = props => {
  return (
    <Theme>
      <CatchErrors>
        <AppStoreProvider>
          <Search {...props} />
        </AppStoreProvider>
      </CatchErrors>
    </Theme>
  )
}

describe("The Search page", () => {
  it(`has an empty state`, async () => {
    const tree = renderWithWrappers(<TestWrapper />)
    expect(tree.root.findAllByType(RecentSearches)).toHaveLength(1)
    expect(tree.root.findAllByType(AutosuggestResults)).toHaveLength(0)
    expect(extractText(tree.root.findByType(CityGuideCTA))).toContain("Explore art on view")
  })

  it(`does not show city guide entrance when on iPad`, async () => {
    const isPadMock = isPad as jest.Mock
    isPadMock.mockImplementationOnce(() => true)
    const tree = renderWithWrappers(<TestWrapper />)
    expect(tree.root.findAllByType(CityGuideCTA)).toHaveLength(0)
  })

  it(`shows city guide entrance when there are recent searches`, async () => {
    __appStoreTestUtils__?.injectState({
      search: {
        recentSearches: [banksy],
      },
    })
    const isPadMock = isPad as jest.Mock
    isPadMock.mockImplementationOnce(() => false)
    const tree = renderWithWrappers(<TestWrapper />)
    expect(extractText(tree.root.findByType(CityGuideCTA))).toContain("Explore art on view")
  })

  it(`shows recent searches when there are recent searches`, () => {
    __appStoreTestUtils__?.injectState({
      search: {
        recentSearches: [banksy],
      },
    })

    const tree = renderWithWrappers(<TestWrapper />)
    expect(tree.root.findAllByType(RecentSearches)).toHaveLength(1)
    expect(tree.root.findAllByType(AutosuggestResults)).toHaveLength(0)
  })

  it(`shows the cancel button when the input focues`, () => {
    const tree = renderWithWrappers(<TestWrapper />)
    expect(extractText(tree.root)).not.toContain("Cancel")
    act(() => {
      tree.root.findByType(TextInput).props.onFocus()
    })
    expect(extractText(tree.root)).toContain("Cancel")
  })

  it(`passes the query to the AutosuggestResults when the query.length is >= 2`, async () => {
    const tree = renderWithWrappers(<TestWrapper />)

    act(() => {
      tree.root.findByType(TextInput).props.onChangeText("m")
    })

    expect(tree.root.findAllByType(AutosuggestResults)).toHaveLength(0)

    act(() => {
      tree.root.findByType(TextInput).props.onChangeText("mi")
    })

    expect(tree.root.findAllByType(AutosuggestResults)).toHaveLength(1)

    act(() => {
      tree.root.findByType(TextInput).props.onChangeText("michael")
    })

    expect(tree.root.findAllByType(RecentSearches)).toHaveLength(0)
    expect(tree.root.findAllByType(AutosuggestResults)).toHaveLength(1)
    expect(tree.root.findByType(AutosuggestResults).props.query).toBe("michael")
  })
})

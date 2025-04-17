import { fireEvent, screen } from "@testing-library/react-native"
import { SearchContext } from "app/Scenes/Search/SearchContext"
import { GlobalStore, GlobalStoreProvider } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { CatchErrors } from "app/utils/CatchErrors"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Pressable, TouchableOpacity } from "react-native"
import { act } from "react-test-renderer"
import { AutosuggestSearchResult } from "./AutosuggestSearchResult"

const inputBlurMock = jest.fn()
const onDeleteMock = jest.fn()

const result = {
  displayLabel: "Banksy",
  formattedNationalityAndBirthday: "British, b. 1974",
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
    recentSearchesArray = []
    jest.clearAllMocks()
  })

  it(`works`, async () => {
    renderWithWrappers(<TestWrapper result={result} showResultType />)

    expect(screen.getByText("Banksy")).toBeTruthy()
    expect(screen.getByText("Artist")).toBeTruthy()
  })

  it("does not render result type when showResultType prop is not passed", async () => {
    renderWithWrappers(<TestWrapper result={result} />)
    expect(screen.queryByText("Artist")).toBeFalsy()
  })

  it("renders result type when showResultType prop is passed", async () => {
    renderWithWrappers(<TestWrapper result={result} showResultType />)
    expect(screen.getByText("Artist")).toBeTruthy()
  })

  it("renders result and highlights the query", async () => {
    renderWithWrappers(<TestWrapper result={result} highlight="Ban" />)

    expect(screen.getByText("Ban")).toHaveProp("color", "blue100")
    expect(screen.getByText("ksy")).toHaveProp("color", "mono100")
  })

  it("does not render delete button when onDelete callback is not passed", async () => {
    renderWithWrappers(<TestWrapper result={result} />)
    expect(screen.queryByLabelText("Remove recent search item")).toBeFalsy()
  })

  it("calls onDelete calback when pressing on delete button", async () => {
    renderWithWrappers(<TestWrapper result={result} onDelete={onDeleteMock} />)

    fireEvent.press(screen.getByLabelText("Remove recent search item"))
    expect(onDeleteMock).toHaveBeenCalled()
  })

  it("blurs the input and navigates to the correct page when tapped", async () => {
    renderWithWrappers(<TestWrapper result={result} />)
    expect(navigate).not.toHaveBeenCalled()
    screen.UNSAFE_getByType(TouchableOpacity).props.onPress()
    await new Promise((r) => setTimeout(r, 50))
    expect(navigate).toHaveBeenCalledWith(`${result.href}`)
  })

  it(`highlights a part of the string even when the string has diacritics but the highlight doesn't`, async () => {
    renderWithWrappers(
      <TestWrapper
        result={{
          ...result,
          displayLabel: "Joãn Miró",
        }}
        highlight="Miro"
      />
    )

    expect(screen.queryByText("Miró")).toHaveProp("color", "blue100")
  })

  it(`updates recent searches by default`, async () => {
    renderWithWrappers(<TestWrapper result={result} />)
    expect(navigate).not.toHaveBeenCalled()
    expect(recentSearchesArray).toHaveLength(0)
    act(() => {
      screen.UNSAFE_getByType(TouchableOpacity).props.onPress()
    })
    await new Promise((r) => setTimeout(r, 50))
    expect(recentSearchesArray).toHaveLength(1)
  })

  it(`won't update recent searches if told not to`, async () => {
    renderWithWrappers(<TestWrapper result={result} updateRecentSearchesOnTap={false} />)
    expect(navigate).not.toHaveBeenCalled()
    expect(recentSearchesArray).toHaveLength(0)
    act(() => {
      screen.UNSAFE_getByType(TouchableOpacity).props.onPress()
    })
    await new Promise((r) => setTimeout(r, 50))
    expect(recentSearchesArray).toHaveLength(0)
  })

  it(`optionally hides the entity type`, () => {
    renderWithWrappers(<TestWrapper result={result} showResultType={false} />)
    expect(screen.queryByText("Artist")).toBeFalsy()
  })

  it(`allows for custom touch handlers on search result items`, () => {
    const spy = jest.fn()
    renderWithWrappers(<TestWrapper result={result} onResultPress={spy} />)
    screen.UNSAFE_getByType(TouchableOpacity).props.onPress()
    expect(spy).toHaveBeenCalled()
  })

  it(`navigates correctly when the item is a fair`, async () => {
    renderWithWrappers(
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
      screen.UNSAFE_getByType(TouchableOpacity).props.onPress()
    })
    await new Promise((r) => setTimeout(r, 50))
    expect(navigate).toHaveBeenCalledWith("/art-expo-diff-profile-slug")
  })

  it(`shows navigation buttons when enabled and available`, async () => {
    renderWithWrappers(
      <TestWrapper
        result={{
          displayLabel: "Banksy",
          href: "/artist/anto-carte",
          imageUrl: "blah",
          __typename: "Artist",
          statuses: {
            artworks: true,
            auctionLots: true,
          },
        }}
        showQuickNavigationButtons
      />
    )

    expect(screen.getByText("Auction Results")).toBeTruthy()
    expect(screen.getByText("Artworks")).toBeTruthy()
  })

  it(`does not show navigation buttons when disabled`, async () => {
    renderWithWrappers(
      <TestWrapper
        result={{
          displayLabel: "Banksy",
          href: "/artist/anto-carte",
          imageUrl: "blah",
          __typename: "Artist",
          statuses: {
            artworks: true,
            auctionLots: true,
          },
        }}
        showQuickNavigationButtons={false}
      />
    )

    expect(screen.queryByText("Auction Results")).toBeFalsy()
    expect(screen.queryByText("Artworks")).toBeFalsy()
  })

  it(`does not show navigation buttons when enabled, but unavailable`, async () => {
    renderWithWrappers(
      <TestWrapper
        result={{
          displayLabel: "Banksy",
          href: "/artist/anto-carte",
          imageUrl: "blah",
          __typename: "Artist",
          statuses: {
            artworks: true,
            auctionLots: false,
          },
        }}
        showQuickNavigationButtons
      />
    )

    expect(screen.queryByText("Auction Results")).toBeFalsy()
    expect(screen.queryByText("Artworks")).toBeFalsy()
  })

  it(`quick navigation buttons navigate correctly`, async () => {
    renderWithWrappers(
      <TestWrapper
        result={{
          displayLabel: "Banksy",
          href: "/artist/anto-carte",
          imageUrl: "blah",
          __typename: "Artist",
          statuses: {
            artworks: true,
            auctionLots: true,
          },
        }}
        showQuickNavigationButtons
      />
    )

    act(() => {
      screen.UNSAFE_getAllByType(Pressable)[0].props.onPress()
    })
    await new Promise((r) => setTimeout(r, 50))
    expect(navigate).toHaveBeenCalledWith("/artist/anto-carte/artworks", {
      passProps: { initialTab: "Artworks" },
    })

    act(() => {
      screen.UNSAFE_getAllByType(Pressable)[1].props.onPress()
    })
    await new Promise((r) => setTimeout(r, 50))
    expect(navigate).toHaveBeenCalledWith("/artist/anto-carte/auction-results", {
      passProps: { initialTab: "Insights" },
    })
  })

  it("should call custom event track handler when search result is pressed", () => {
    const trackResultPressMock = jest.fn()
    renderWithWrappers(
      <TestWrapper result={result} itemIndex={1} trackResultPress={trackResultPressMock} />
    )

    fireEvent.press(screen.getAllByText("Banksy")[0])

    expect(trackResultPressMock).toBeCalledWith(result, 1)
  })

  it("renders disambiguating info for artists", () => {
    renderWithWrappers(<TestWrapper result={result} highlight="Ban" />)
    expect(screen.getByText("British, b. 1974")).toBeTruthy()
  })
})

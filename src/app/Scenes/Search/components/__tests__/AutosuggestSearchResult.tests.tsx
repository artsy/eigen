import { fireEvent, screen } from "@testing-library/react-native"
import { SearchContext } from "app/Scenes/Search/SearchContext"
import { AutosuggestSearchResult } from "app/Scenes/Search/components/AutosuggestSearchResult"
import { GlobalStore, GlobalStoreProvider } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

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
      <_TestWrapper {...props} />
    </SearchContext.Provider>
  </GlobalStoreProvider>
)

describe(AutosuggestSearchResult, () => {
  beforeEach(() => {
    recentSearchesArray = []
    jest.clearAllMocks()
  })

  it(`works`, async () => {
    await renderWithWrappers(<TestWrapper result={result} showResultType />)

    expect(screen.getByText("Banksy")).toBeTruthy()
    expect(screen.getByText("Artist")).toBeTruthy()
  })

  it("does not render result type when showResultType prop is not passed", async () => {
    await renderWithWrappers(<TestWrapper result={result} />)
    expect(screen.queryByText("Artist")).toBeFalsy()
  })

  it("renders result type when showResultType prop is passed", async () => {
    await renderWithWrappers(<TestWrapper result={result} showResultType />)
    expect(screen.getByText("Artist")).toBeTruthy()
  })

  it("renders result and highlights the query", async () => {
    await renderWithWrappers(<TestWrapper result={result} highlight="Ban" />)

    expect(screen.getByText("Ban")).toHaveProp("color", "blue100")
    expect(screen.getByText("ksy")).toHaveProp("color", "mono100")
  })

  it("does not render delete button when onDelete callback is not passed", async () => {
    await renderWithWrappers(<TestWrapper result={result} />)
    expect(screen.queryByLabelText("Remove recent search item")).toBeFalsy()
  })

  it("calls onDelete calback when pressing on delete button", async () => {
    await renderWithWrappers(<TestWrapper result={result} onDelete={onDeleteMock} />)

    await fireEvent.press(screen.getByLabelText("Remove recent search item"))
    expect(onDeleteMock).toHaveBeenCalled()
  })

  it("blurs the input and navigates to the correct page when tapped", async () => {
    await renderWithWrappers(<TestWrapper result={result} />)
    expect(navigate).not.toHaveBeenCalled()
    await fireEvent.press(screen.getByTestId("autosuggest-search-result-Banksy"))
    await new Promise((r) => setTimeout(r, 50))
    expect(navigate).toHaveBeenCalledWith(`${result.href}`)
  })

  it(`highlights a part of the string even when the string has diacritics but the highlight doesn't`, async () => {
    await renderWithWrappers(
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
    await renderWithWrappers(<TestWrapper result={result} />)
    expect(navigate).not.toHaveBeenCalled()
    expect(recentSearchesArray).toHaveLength(0)
    await fireEvent.press(screen.getByTestId("autosuggest-search-result-Banksy"))
    await new Promise((r) => setTimeout(r, 50))
    expect(recentSearchesArray).toHaveLength(1)
  })

  it(`won't update recent searches if told not to`, async () => {
    await renderWithWrappers(<TestWrapper result={result} updateRecentSearchesOnTap={false} />)
    expect(navigate).not.toHaveBeenCalled()
    expect(recentSearchesArray).toHaveLength(0)
    await fireEvent.press(screen.getByTestId("autosuggest-search-result-Banksy"))
    await new Promise((r) => setTimeout(r, 50))
    expect(recentSearchesArray).toHaveLength(0)
  })

  it(`optionally hides the entity type`, async () => {
    await renderWithWrappers(<TestWrapper result={result} showResultType={false} />)
    expect(screen.queryByText("Artist")).toBeFalsy()
  })

  it(`allows for custom touch handlers on search result items`, async () => {
    const spy = jest.fn()
    await renderWithWrappers(<TestWrapper result={result} onResultPress={spy} />)
    await fireEvent.press(screen.getByTestId("autosuggest-search-result-Banksy"))
    expect(spy).toHaveBeenCalled()
  })

  it(`navigates correctly when the item is a fair`, async () => {
    await renderWithWrappers(
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
    await fireEvent.press(screen.getByTestId("autosuggest-search-result-Art Expo 2020"))
    await new Promise((r) => setTimeout(r, 50))
    expect(navigate).toHaveBeenCalledWith("/art-expo-diff-profile-slug")
  })

  it(`shows navigation buttons when enabled and available`, async () => {
    await renderWithWrappers(
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
    await renderWithWrappers(
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
    await renderWithWrappers(
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
    await renderWithWrappers(
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

    await fireEvent.press(screen.getByText("Artworks"))
    await new Promise((r) => setTimeout(r, 50))
    expect(navigate).toHaveBeenCalledWith("/artist/anto-carte/artworks", {
      passProps: { initialTab: "Artworks" },
    })

    await fireEvent.press(screen.getByText("Auction Results"))
    await new Promise((r) => setTimeout(r, 50))
    expect(navigate).toHaveBeenCalledWith("/artist/anto-carte/auction-results", {
      passProps: { initialTab: "Insights" },
    })
  })

  it("should call custom event track handler when search result is pressed", async () => {
    const trackResultPressMock = jest.fn()
    await renderWithWrappers(
      <TestWrapper result={result} itemIndex={1} trackResultPress={trackResultPressMock} />
    )

    await fireEvent.press(screen.getAllByText("Banksy")[0])

    expect(trackResultPressMock).toBeCalledWith(result, 1)
  })

  it("renders disambiguating info for artists", async () => {
    await renderWithWrappers(<TestWrapper result={result} highlight="Ban" />)
    expect(screen.getByText("British, b. 1974")).toBeTruthy()
  })
})

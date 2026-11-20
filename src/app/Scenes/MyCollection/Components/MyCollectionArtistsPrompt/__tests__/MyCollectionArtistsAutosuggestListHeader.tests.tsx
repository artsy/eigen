import { fireEvent, screen } from "@testing-library/react-native"
import { MyCollectionArtistsAutosuggestListHeader } from "app/Scenes/MyCollection/Components/MyCollectionArtistsPrompt/MyCollectionArtistsAutosuggestListHeader"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock(
  "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore",
  () => ({
    MyCollectionAddCollectedArtistsStore: {
      useStoreActions: jest.fn(),
      useStoreState: jest.fn(),
    },
  })
)

describe("MyCollectionArtistsAutosuggestListHeader", () => {
  const render = (props = {}) =>
    renderWithWrappers(
      <MyCollectionArtistsAutosuggestListHeader
        resultsLength={0}
        isLoading={false}
        query="abc"
        debouncedQuery="abcde"
        {...props}
      />
    )

  it("renders given results", async () => {
    await render({ resultsLength: 1 })

    expect(screen.getByText("Can't find the artist?")).toBeOnTheScreen()
  })

  it("triggers navigation when 'Add their name' is pressed", async () => {
    await render({ resultsLength: 1 })

    await fireEvent.press(screen.getByText("Add their name."))

    expect(navigate).toHaveBeenCalledWith("/my-collection/artists/new", expect.anything())
  })

  it("renders given no results", async () => {
    await render({ resultsLength: 0 })

    expect(screen.getByText(`No results for "abc"`, { exact: false })).toBeOnTheScreen()
  })

  it("renders given no results and empty debouncedQuery", async () => {
    await render({ resultsLength: 0, debouncedQuery: "" })

    expect(
      screen.getByText(
        "Results will appear here as you search. Select an artist to add them to your collection."
      )
    ).toBeOnTheScreen()
  })
})

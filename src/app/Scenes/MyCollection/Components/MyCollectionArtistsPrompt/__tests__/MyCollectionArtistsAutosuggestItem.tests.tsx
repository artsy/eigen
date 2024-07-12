import { screen } from "@testing-library/react-native"
import { MyCollectionArtistsAutosuggestItem } from "app/Scenes/MyCollection/Components/MyCollectionArtistsPrompt/MyCollectionArtistsAutosuggestItem"
import { MyCollectionAddCollectedArtistsStore } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock(
  "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore",
  () => ({
    MyCollectionAddCollectedArtistsStore: {
      useStoreActions: jest.fn(),
      useStoreState: jest.fn(),
    },
  })
)

describe("MyCollectionArtistsAutosuggestItem", () => {
  const mockStoreState = MyCollectionAddCollectedArtistsStore.useStoreState as jest.Mock

  const { renderWithRelay } = setupTestWrapper({
    Component: MyCollectionArtistsAutosuggestItem,
    query: graphql`
      query MyCollectionArtistsAutosuggestItemTestsQuery {
        artist(id: "artist-id") {
          ...MyCollectionArtistsAutosuggestItem_artist
        }
      }
    `,
  })

  beforeEach(() => {
    mockStoreState.mockReturnValue(["artist-1", "artist-2"])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders", () => {
    renderWithRelay()

    expect(
      screen.getByText(/mock-value-for-field-"formattedNationalityAndBirthday"/)
    ).toBeOnTheScreen()
    expect(screen.getByText(/mock-value-for-field-"name"/)).toBeOnTheScreen()
  })

  it("renders selected artist", () => {
    renderWithRelay({ Artist: () => ({ internalID: "artist-1" }) })

    expect(screen.getByText("Selected")).toBeOnTheScreen()
  })
})

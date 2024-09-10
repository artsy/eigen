import { fireEvent, screen } from "@testing-library/react-native"
import { MyCollectionArtistsAutosuggest } from "app/Scenes/MyCollection/Components/MyCollectionArtistsPrompt/MyCollectionArtistsAutosuggest"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Suspense } from "react"
import { Keyboard } from "react-native"
import { graphql } from "react-relay"

jest.mock(
  "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore",
  () => ({
    MyCollectionAddCollectedArtistsStore: {
      useStoreActions: jest.fn(),
      useStoreState: () => [],
    },
  })
)

const mockExpand = jest.fn()
const mockCollapse = jest.fn()
jest.mock("@gorhom/bottom-sheet", () => ({
  ...jest.requireActual("@gorhom/bottom-sheet"),
  useBottomSheet: () => ({
    expand: mockExpand,
    collapse: mockCollapse,
    animatedIndex: { value: 0 },
  }),
}))

describe("MyCollectionArtistsAutosuggest", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => (
      <Suspense fallback={null}>
        <MyCollectionArtistsAutosuggest />
      </Suspense>
    ),
    query: graphql`
      query MyCollectionArtistsAutosuggestTestsQuery {
        matchConnection(term: "test", entities: ARTIST, mode: AUTOSUGGEST, first: 7) {
          edges {
            node {
              __typename
            }
          }
        }
      }
    `,
  })

  afterEach(jest.clearAllMocks)

  it("renders", async () => {
    const { mockResolveLastOperation } = renderWithRelay()

    mockResolveLastOperation({ MatchConnection: () => ({ edges: [] }) })

    const input = await screen.findByPlaceholderText("Search for artists on Artsy")
    expect(input).toBeOnTheScreen()

    fireEvent.changeText(input, "test")
  })

  it("renders matches", async () => {
    const { mockResolveLastOperation } = renderWithRelay()

    mockResolveLastOperation({ MatchConnection: () => ({ edges: matches }) })

    expect(await screen.findAllByText(/mock-value-for-field-"name"/)).toHaveLength(2)
  })

  it("calls expand on focus", async () => {
    const { mockResolveLastOperation } = renderWithRelay()

    mockResolveLastOperation({ MatchConnection: () => ({ edges: [] }) })

    const input = await screen.findByPlaceholderText("Search for artists on Artsy")
    fireEvent(input, "focus")

    expect(mockExpand).toHaveBeenCalledTimes(1)
  })

  it("calls collapse on blur", async () => {
    const { mockResolveLastOperation } = renderWithRelay()

    mockResolveLastOperation({ MatchConnection: () => ({ edges: [] }) })

    const input = await screen.findByPlaceholderText("Search for artists on Artsy")
    fireEvent(input, "focus")
    fireEvent(input, "blur")

    expect(mockCollapse).toHaveBeenCalledTimes(1)
  })

  it("does not call collapse on blur given matches", async () => {
    const { mockResolveLastOperation } = renderWithRelay()

    mockResolveLastOperation({ MatchConnection: () => ({ edges: matches }) })

    const input = await screen.findByPlaceholderText("Search for artists on Artsy")
    fireEvent(input, "focus")
    fireEvent(input, "blur")

    expect(mockCollapse).not.toHaveBeenCalled()
  })

  it("calls collapse on clear", async () => {
    jest.spyOn(Keyboard, "isVisible").mockReturnValue(false)
    const { mockResolveLastOperation } = renderWithRelay()

    mockResolveLastOperation({ MatchConnection: () => ({ edges: [] }) })

    const input = await screen.findByPlaceholderText("Search for artists on Artsy")
    fireEvent.changeText(input, "test")

    const clearButton = await screen.findByTestId("clear-input-button")
    fireEvent.press(clearButton)

    expect(mockCollapse).toHaveBeenCalledTimes(1)
  })

  it("calls collapse on clear given the keyboard visible", async () => {
    jest.spyOn(Keyboard, "isVisible").mockReturnValue(true)
    const { mockResolveLastOperation } = renderWithRelay()

    mockResolveLastOperation({ MatchConnection: () => ({ edges: [] }) })

    const input = await screen.findByPlaceholderText("Search for artists on Artsy")
    fireEvent.changeText(input, "test")

    const clearButton = await screen.findByTestId("clear-input-button")
    fireEvent.press(clearButton)

    expect(mockCollapse).toHaveBeenCalledTimes(0)
  })
})

const matches = [
  { node: { __typename: "Artist", internalID: "artist-1" } },
  { node: { __typename: "Artist", internalID: "artist-2" } },
]

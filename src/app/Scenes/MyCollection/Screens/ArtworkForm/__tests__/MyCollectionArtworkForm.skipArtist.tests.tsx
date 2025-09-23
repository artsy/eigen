import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { AutosuggestResultsQuery } from "__generated__/AutosuggestResultsQuery.graphql"
import { Tab } from "app/Scenes/MyCollection/MyCollection"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { createMockEnvironment } from "relay-test-utils"

jest.mock("app/Scenes/MyCollection/Screens/ArtworkForm/Screens/MyCollectionArtworkFormMain", () => {
  const { Text } = require("react-native")
  return {
    MyCollectionArtworkFormMain: () => <Text testID="fake-main-form" />,
  }
})

// eslint-disable-next-line import/order
import { MyCollectionArtworkFormScreen } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"

/**
 * These tests are separated from the main MyCollectionArtworkForm tests
 * because the mocking of the main form breaks the other tests.
 * Without this mock the tests hang when submitting the form.
 */
describe("when skipping the artist selection", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = getMockRelayEnvironment()
  })

  it("initializes the artist name input field", async () => {
    const { unmount } = renderWithHookWrappersTL(
      <MyCollectionArtworkFormScreen mode="add" source={Tab.collection} />,
      mockEnvironment
    )

    act(() =>
      mockEnvironment.mock.resolveMostRecentOperation({
        errors: [],
        data: mockCollectedArtistsResult,
      })
    )

    await flushPromiseQueue()

    // Select Artist Screen

    expect(screen.getByText("Select an Artist")).toBeTruthy()

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search for artists on Artsy")).toBeTruthy()
    })

    fireEvent.changeText(screen.getByPlaceholderText("Search for artists on Artsy"), "foo bar")

    act(() =>
      mockEnvironment.mock.resolveMostRecentOperation({
        errors: [],
        data: mockArtistSearchResult,
      })
    )

    fireEvent.press(screen.getByTestId("my-collection-artwork-form-artist-skip-button"))

    await flushPromiseQueue()

    // Add Artist Screen
    fireEvent.changeText(screen.getByTestId("artist-input"), "My Artist")
    fireEvent.changeText(screen.getByTestId("nationality-input"), "bar foo")

    await flushPromiseQueue()

    expect(true).toBe(true)

    fireEvent.press(screen.getByTestId("submit-add-artist-button"))

    await waitFor(() => {
      expect(screen.getByTestId("fake-main-form")).toBeTruthy()
    })

    unmount()
  })
})

const mockCollectedArtistsResult = {
  me: {
    userInterestsConnection: {
      edges: [
        {
          node: {
            __typename: "Artist",
            displayLabel: "My Artist",
            formattedNationalityAndBirthday: "British, b. 1974",
            initials: "MA",
            internalID: "my-artist-id",
            slug: "My Artist",
          },
        },
      ],
    },
  },
}

const mockArtistSearchResult: AutosuggestResultsQuery["rawResponse"] = {
  results: {
    edges: [
      {
        cursor: "page-1",
        node: {
          __isNode: "SearchableItem",
          __typename: "SearchableItem",
          internalID: "internal-id",
          displayLabel: "Banksy",
          displayType: "Artist",
          href: "banksy-href",
          id: "banksy",
          imageUrl: "",
          slug: "banksy",
        },
      },
    ],
    pageInfo: {
      endCursor: "page-2",
      hasNextPage: true,
    },
  },
}

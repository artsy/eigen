import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import {
  ARTWORK_LISTS_CONTEXT_INITIAL_STATE,
  ArtworkListsContext,
} from "app/Components/ArtworkLists/ArtworkListsContext"
import { ArtworkEntity, ArtworkListsContextState } from "app/Components/ArtworkLists/types"
import { CreateNewArtworkListView } from "app/Components/ArtworkLists/views/CreateNewArtworkListView/CreateNewArtworkListView"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { noop } from "lodash"
import { graphql } from "react-relay"

describe("CreateNewArtworkListView", () => {
  const inputPlaceholder = "Name your list"
  const helloWorldText = "Hello World"

  const ContextValue: ArtworkListsContextState = {
    state: {
      ...ARTWORK_LISTS_CONTEXT_INITIAL_STATE,
      artwork: artworkEntity,
    },
    addingArtworkListIDs: [],
    removingArtworkListIDs: [],
    keepArtworkListPrivateIDs: [],
    shareArtworkListIDs: [],
    dispatch: noop,
    reset: noop,
    onSave: noop,
  }

  const { renderWithRelay } = setupTestWrapper({
    Component: () => {
      return (
        <ArtworkListsContext.Provider value={ContextValue}>
          <CreateNewArtworkListView />
        </ArtworkListsContext.Provider>
      )
    },
    // added the query to make the component wrapped with a Relay environment
    query: graphql`
      query CreateNewArtworkListViewTestsQuery {
        me {
          internalID
        }
      }
    `,
  })

  describe("Error state", () => {
    it("when artwork list name is empty", async () => {
      renderWithRelay()

      fireEvent.changeText(screen.getByPlaceholderText(inputPlaceholder), helloWorldText)
      fireEvent.changeText(screen.getByPlaceholderText(inputPlaceholder), "")

      expect(await screen.findByText("Name is required"))
    })

    it("when mutation returned error", async () => {
      console.error = jest.fn() // Silences component logging.

      const errorMessage = "You already have a list with this name."

      const { mockResolveLastOperation } = renderWithRelay()

      fireEvent.changeText(screen.getByPlaceholderText(inputPlaceholder), helloWorldText)
      fireEvent.press(screen.getByText("Save"))

      await waitFor(() => {
        mockResolveLastOperation({
          Mutation: () => ({
            createCollection: {
              responseOrError: {
                __typename: "CreateCollectionFailure",
                mutationError: {
                  fieldErrors: [
                    {
                      name: "name",
                      message: errorMessage,
                    },
                  ],
                },
              },
            },
          }),
        })
      })

      expect(screen.getByText(errorMessage)).toBeOnTheScreen()
    })
  })

  describe("Save button", () => {
    it("disabled by default", () => {
      renderWithRelay()

      expect(screen.getByText("Save")).toBeDisabled()
    })

    it("disabled when artwork list name is empty", () => {
      renderWithRelay()

      fireEvent.changeText(screen.getByPlaceholderText(inputPlaceholder), helloWorldText)
      fireEvent.changeText(screen.getByPlaceholderText(inputPlaceholder), "")

      expect(screen.getByText("Save")).toBeDisabled()
    })

    it("enabled when artwork list name is entered", () => {
      renderWithRelay()

      fireEvent.changeText(screen.getByPlaceholderText(inputPlaceholder), helloWorldText)

      expect(screen.getByText("Save")).toBeEnabled()
    })
  })

  describe("Textual content", () => {
    it("default state", () => {
      renderWithRelay()

      expect(screen.getByText("Create a new list")).toBeOnTheScreen()
    })

    it("default state with AREnableArtworkListOfferability ff on", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableArtworkListOfferability: true,
      })

      renderWithRelay()

      expect(screen.getByText("Create a new list")).toBeOnTheScreen()
      expect(screen.getByText("Shared list")).toBeOnTheScreen()
    })
  })

  describe("Remaining characters", () => {
    it("default state", () => {
      renderWithRelay()

      expect(screen.getByText("0 / 40")).toBeOnTheScreen()
    })

    it("when user entered 39 characters", () => {
      renderWithRelay()

      const longText = "a".repeat(39)
      fireEvent.changeText(screen.getByPlaceholderText(inputPlaceholder), longText)

      expect(screen.getByText("39 / 40")).toBeOnTheScreen()
    })

    it("when user entered something", () => {
      renderWithRelay()

      fireEvent.changeText(screen.getByPlaceholderText(inputPlaceholder), "abc")

      expect(screen.getByText("3 / 40")).toBeOnTheScreen()
    })

    // Known issue with react native testing library
    // context: https://github.com/callstack/react-native-testing-library/issues/1239
    it.skip("when user has reached the allowed limit", async () => {
      renderWithRelay()

      const longText = "a".repeat(100)
      fireEvent(screen.getByPlaceholderText(inputPlaceholder), "changeText", longText)

      expect(screen.getByText("40 / 40")).toBeOnTheScreen()
    })
  })
})

const artworkEntity: ArtworkEntity = {
  id: "artwork-id",
  internalID: "artwork-internal-id",
  title: "Artwork Title",
  year: "2023",
  artistNames: "Banksy",
  imageURL: null,
}

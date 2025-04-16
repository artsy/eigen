import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ArtworkListsStore } from "app/Components/ArtworkLists/ArtworkListsStore"
import { ARTWORK_LISTS_STORE_INITIAL_STATE, ArtworkEntity } from "app/Components/ArtworkLists/types"
import { CreateNewArtworkListView } from "app/Components/ArtworkLists/views/CreateNewArtworkListView/CreateNewArtworkListView"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { noop } from "lodash"
import { Keyboard, Platform } from "react-native"
import { graphql } from "react-relay"

describe("CreateNewArtworkListView", () => {
  const inputPlaceholder = "Name your list"
  const helloWorldText = "Hello World"

  const ContextValue = {
    state: {
      ...ARTWORK_LISTS_STORE_INITIAL_STATE,
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
        <ArtworkListsStore.Provider runtimeModel={ContextValue}>
          <CreateNewArtworkListView />
        </ArtworkListsStore.Provider>
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

      const input = screen.getByPlaceholderText(inputPlaceholder)
      fireEvent.changeText(input, helloWorldText)
      fireEvent.changeText(input, "")

      expect(await screen.findByText("Name is required"))
    })

    it("submit (blur) when artwork list name is empty", async () => {
      renderWithRelay()

      const input = screen.getByPlaceholderText(inputPlaceholder)
      fireEvent.changeText(input, "")

      fireEvent(input, "submitEditing")

      expect(await screen.findByText("Name is required"))
    })

    it("when mutation returned error", async () => {
      console.error = jest.fn() // Silences component logging.

      const errorMessage = "You already have a list with this name."

      const { mockResolveLastOperation } = renderWithRelay()
      jest.spyOn(Keyboard, "isVisible").mockReturnValue(true)

      const input = screen.getByPlaceholderText(inputPlaceholder)
      fireEvent.changeText(input, helloWorldText)

      fireEvent(input, "submitEditing")

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

  describe("Save button, Android only", () => {
    beforeEach(() => {
      Platform.OS = "android"
    })

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

  describe("Sucess state Android", () => {
    beforeEach(() => {
      Platform.OS = "android"
    })

    it("when mutation returned success", async () => {
      const { mockResolveLastOperation } = renderWithRelay()
      jest.spyOn(Keyboard, "isVisible").mockReturnValue(false)

      const input = screen.getByPlaceholderText(inputPlaceholder)
      fireEvent.changeText(input, helloWorldText)

      fireEvent.press(screen.getByText("Save"))

      await waitFor(() => {
        mockResolveLastOperation({
          Mutation: () => ({
            createCollection: {
              responseOrError: {
                __typename: "CreateCollectionSuccess",
                collection: {
                  internalID: "artwork-list-id",
                  name: helloWorldText,
                  shareableWithPartners: true,
                  artworksCount: 0,
                },
              },
            },
          }),
        })
      })

      expect(screen.queryByText("Name is required")).not.toBeOnTheScreen()
    })
  })

  describe("Sucess state iOS", () => {
    beforeEach(() => {
      Platform.OS = "ios"
    })

    it("when mutation returned success", async () => {
      const { mockResolveLastOperation } = renderWithRelay()
      jest.spyOn(Keyboard, "isVisible").mockReturnValue(false)

      const input = screen.getByPlaceholderText(inputPlaceholder)
      fireEvent.changeText(input, helloWorldText)

      fireEvent(input, "submitEditing")

      await waitFor(() => {
        mockResolveLastOperation({
          Mutation: () => ({
            createCollection: {
              responseOrError: {
                __typename: "CreateCollectionSuccess",
                collection: {
                  internalID: "artwork-list-id",
                  name: helloWorldText,
                  shareableWithPartners: true,
                  artworksCount: 0,
                },
              },
            },
          }),
        })
      })

      expect(screen.queryByText("Name is required")).not.toBeOnTheScreen()
    })
  })

  describe("Textual content", () => {
    it("default state", () => {
      renderWithRelay()

      expect(screen.getByText("New list")).toBeOnTheScreen()
    })

    it("default state with AREnableArtworkListOfferability ff on", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableArtworkListOfferability: true,
      })

      renderWithRelay()

      expect(screen.getByText("New list")).toBeOnTheScreen()
      expect(screen.getByText("Share list with galleries")).toBeOnTheScreen()

      // test that the explanatory text is not visible by default
      expect(screen.queryByText("Shared lists are eligible to receive")).not.toBeOnTheScreen()
      fireEvent.press(screen.getByText("Share list with galleries", { exact: false }))
      expect(
        screen.getByText("Shared lists are eligible to receive", { exact: false })
      ).toBeOnTheScreen()
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
    it.skip("when user has reached the allowed limit", () => {
      renderWithRelay()

      const longText = "a".repeat(100)
      fireEvent(screen.getByPlaceholderText(inputPlaceholder), "changeText", longText)

      expect(screen.getByText("40 / 40")).toBeOnTheScreen()
    })
  })
})

const artworkEntity: ArtworkEntity = {
  artistNames: "Banksy",
  id: "artwork-id",
  imageURL: null,
  internalID: "artwork-internal-id",
  isInAuction: false,
  title: "Artwork Title",
  year: "2023",
}

import { fireEvent, waitFor } from "@testing-library/react-native"
import {
  ARTWORK_LISTS_CONTEXT_INITIAL_STATE,
  ArtworkListsContext,
} from "app/Components/ArtworkLists/ArtworkListsContext"
import { ArtworkEntity, ArtworkListsContextState } from "app/Components/ArtworkLists/types"
import { CreateNewArtworkListView } from "app/Components/ArtworkLists/views/CreateNewArtworkListView/CreateNewArtworkListView"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { noop } from "lodash"
import { createMockEnvironment } from "relay-test-utils"

describe("CreateNewArtworkListView", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const placeholder = "Name your list"
  const text = "Hello World"

  const TestRenderer = () => {
    const value: ArtworkListsContextState = {
      state: {
        ...ARTWORK_LISTS_CONTEXT_INITIAL_STATE,
        artwork: artworkEntity,
      },
      addingArtworkListIDs: [],
      removingArtworkListIDs: [],
      dispatch: noop,
      reset: noop,
      onSave: noop,
    }

    return (
      <ArtworkListsContext.Provider value={value}>
        <CreateNewArtworkListView />
      </ArtworkListsContext.Provider>
    )
  }

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  describe("Remaining characters label", () => {
    it("default state", () => {
      const { getByText } = renderWithHookWrappersTL(<TestRenderer />)

      const text = "40 characters remaining"
      expect(getByText(text)).toBeTruthy()
    })

    it("when user entered 39 characters", () => {
      const { getByText, getByPlaceholderText } = renderWithHookWrappersTL(<TestRenderer />)

      const longText = "a".repeat(39)
      fireEvent.changeText(getByPlaceholderText(placeholder), longText)

      const text = "1 character remaining"
      expect(getByText(text)).toBeTruthy()
    })

    it("when user entered something", () => {
      const { getByText, getByPlaceholderText } = renderWithHookWrappersTL(<TestRenderer />)

      fireEvent.changeText(getByPlaceholderText(placeholder), "abc")

      const text = "37 characters remaining"
      expect(getByText(text)).toBeTruthy()
    })

    it("when user has reached the allowed limit", () => {
      const { getByText, getByPlaceholderText } = renderWithHookWrappersTL(<TestRenderer />)

      const longText = "a".repeat(100)
      fireEvent.changeText(getByPlaceholderText(placeholder), longText)

      const text = "0 characters remaining"
      expect(getByText(text)).toBeTruthy()
    })
  })

  describe("Error state", () => {
    it("when artwork list name is empty", async () => {
      const { getByText, getByPlaceholderText } = renderWithHookWrappersTL(<TestRenderer />)

      fireEvent.changeText(getByPlaceholderText(placeholder), text)
      fireEvent.changeText(getByPlaceholderText(placeholder), "")

      await waitFor(() => expect(getByText("Name is required")).toBeTruthy())
    })

    it("when mutation returned error", async () => {
      console.error = jest.fn() // Silences component logging.

      const errorMessage = "You already have a list with this name."
      const { getByText, getByPlaceholderText } = renderWithHookWrappersTL(
        <TestRenderer />,
        mockEnvironment
      )

      fireEvent.changeText(getByPlaceholderText(placeholder), text)
      fireEvent.press(getByText("Save"))

      await flushPromiseQueue()

      resolveMostRecentRelayOperation(mockEnvironment, {
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

      await waitFor(() => expect(getByText(errorMessage)).toBeTruthy())
    })
  })

  describe("Save button", () => {
    it("disabled by default", () => {
      const { getByText } = renderWithHookWrappersTL(<TestRenderer />)

      expect(getByText("Save")).toBeDisabled()
    })

    it("disabled when artwork list name is empty", () => {
      const { getByText, getByPlaceholderText } = renderWithHookWrappersTL(<TestRenderer />)

      fireEvent.changeText(getByPlaceholderText(placeholder), text)
      fireEvent.changeText(getByPlaceholderText(placeholder), "")

      expect(getByText("Save")).toBeDisabled()
    })

    it("enabled when artwork list name is entered", () => {
      const { getByText, getByPlaceholderText } = renderWithHookWrappersTL(<TestRenderer />)

      fireEvent.changeText(getByPlaceholderText(placeholder), text)

      expect(getByText("Save")).toBeEnabled()
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

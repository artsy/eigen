import Clipboard from "@react-native-clipboard/clipboard"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { getShareURL } from "app/Components/ShareSheet/helpers"
import { HeaderMenuArtworkListEntity } from "app/Scenes/ArtworkList/types"
import { ShareArtworkListView } from "app/Scenes/ArtworkList/views/ShareArtworkListView/ShareArtworkListView"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"

const CURRENT_USER_ID = "user-123"

const mockEntity: HeaderMenuArtworkListEntity = {
  title: "My List",
  internalID: "coll-internalID",
  shareableWithPartners: false,
  slug: "my-list",
  private: true,
  default: false,
}

const mountComponent = async (entity: HeaderMenuArtworkListEntity) => {
  await renderWithWrappers(
    <ShareArtworkListView visible artworkListEntity={entity} onDismiss={jest.fn()} />
  )
}

describe("ShareArtworkListView", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectState({ auth: { userID: CURRENT_USER_ID } })
    jest.clearAllMocks()
  })

  it("renders the list title", async () => {
    await mountComponent(mockEntity)
    // &ldquo; and &rdquo; render as curly quotes in React
    expect(screen.getByText("Share “My List”")).toBeOnTheScreen()
  })

  describe("toggle", () => {
    it("fires the mutation with private: false when toggled on", async () => {
      await mountComponent(mockEntity)
      const relayEnv = getMockRelayEnvironment()

      await fireEvent(screen.getByLabelText("Enable sharing"), "onValueChange", true)

      await waitFor(() => {
        expect(relayEnv.mock.getMostRecentOperation().request.variables.input).toEqual({
          id: "coll-internalID",
          private: false,
        })
      })
    })

    it("reverts the toggle on UpdateCollectionFailure", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {})
      await mountComponent(mockEntity)
      const relayEnv = getMockRelayEnvironment()

      const toggle = screen.getByLabelText("Enable sharing")
      expect(toggle.props.value).toBe(false)

      await fireEvent(toggle, "onValueChange", true)
      expect(toggle.props.value).toBe(true)

      await resolveMostRecentRelayOperation(relayEnv, {
        Mutation: () => ({
          updateCollection: {
            responseOrError: {
              __typename: "UpdateCollectionFailure",
              mutationError: { fieldErrors: [] },
            },
          },
        }),
      })

      await waitFor(() => {
        expect(toggle.props.value).toBe(false)
      })
    })

    it("reverts the toggle on a top-level GraphQL error (updateCollection null)", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {})
      await mountComponent(mockEntity)
      const relayEnv = getMockRelayEnvironment()

      const toggle = screen.getByLabelText("Enable sharing")
      expect(toggle.props.value).toBe(false)

      await fireEvent(toggle, "onValueChange", true)
      expect(toggle.props.value).toBe(true)

      await resolveMostRecentRelayOperation(relayEnv, {
        Mutation: () => ({ updateCollection: null }),
      })

      await waitFor(() => {
        expect(toggle.props.value).toBe(false)
      })
    })

    it("uses the slug from the UpdateCollectionSuccess response in the URL", async () => {
      await mountComponent(mockEntity)
      const relayEnv = getMockRelayEnvironment()

      await fireEvent(screen.getByLabelText("Enable sharing"), "onValueChange", true)

      await resolveMostRecentRelayOperation(relayEnv, {
        Mutation: () => ({
          updateCollection: {
            responseOrError: {
              __typename: "UpdateCollectionSuccess",
              collection: {
                slug: "server-assigned-slug",
                private: false,
                internalID: "coll-internalID",
              },
            },
          },
        }),
      })

      await waitFor(() => {
        expect(
          screen.getByDisplayValue(
            getShareURL(`/user/${CURRENT_USER_ID}/collection/server-assigned-slug`)
          )
        ).toBeOnTheScreen()
      })
    })
  })

  describe("copy link", () => {
    it("copies the URL with slug to the clipboard", async () => {
      await mountComponent({ ...mockEntity, private: false })

      await fireEvent.press(screen.getByText("Copy link"))

      expect(Clipboard.setString).toHaveBeenCalledWith(
        getShareURL(`/user/${CURRENT_USER_ID}/collection/my-list`)
      )
    })

    it("falls back to internalID when slug is null", async () => {
      await mountComponent({ ...mockEntity, private: false, slug: null })

      await fireEvent.press(screen.getByText("Copy link"))

      expect(Clipboard.setString).toHaveBeenCalledWith(
        getShareURL(`/user/${CURRENT_USER_ID}/collection/coll-internalID`)
      )
    })
  })
})

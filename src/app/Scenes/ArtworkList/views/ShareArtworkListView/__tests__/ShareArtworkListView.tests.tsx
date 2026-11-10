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

const mountComponent = (entity: HeaderMenuArtworkListEntity) => {
  renderWithWrappers(
    <ShareArtworkListView visible artworkListEntity={entity} onDismiss={jest.fn()} />
  )
}

describe("ShareArtworkListView", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectState({ auth: { userID: CURRENT_USER_ID } })
    jest.clearAllMocks()
  })

  it("renders the list title", () => {
    mountComponent(mockEntity)
    // &ldquo; and &rdquo; render as curly quotes in React
    expect(screen.getByText("Share “My List”")).toBeOnTheScreen()
  })

  describe("toggle", () => {
    it("fires the mutation with private: false when toggled on", async () => {
      mountComponent(mockEntity)
      const relayEnv = getMockRelayEnvironment()

      fireEvent(screen.getByLabelText("Enable sharing"), "onValueChange", true)

      await waitFor(() => {
        expect(relayEnv.mock.getMostRecentOperation().request.variables.input).toEqual({
          id: "coll-internalID",
          private: false,
        })
      })
    })

    it("reverts the toggle on UpdateCollectionFailure", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {})
      mountComponent(mockEntity)
      const relayEnv = getMockRelayEnvironment()

      const toggle = screen.getByLabelText("Enable sharing")
      expect(toggle.props.value).toBe(false)

      fireEvent(toggle, "onValueChange", true)
      expect(toggle.props.value).toBe(true)

      resolveMostRecentRelayOperation(relayEnv, {
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

    it("uses the slug from the UpdateCollectionSuccess response in the URL", async () => {
      mountComponent(mockEntity)
      const relayEnv = getMockRelayEnvironment()

      fireEvent(screen.getByLabelText("Enable sharing"), "onValueChange", true)

      resolveMostRecentRelayOperation(relayEnv, {
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
    it("copies the URL with slug to the clipboard", () => {
      mountComponent({ ...mockEntity, private: false })

      fireEvent.press(screen.getByText("Copy link"))

      expect(Clipboard.setString).toHaveBeenCalledWith(
        getShareURL(`/user/${CURRENT_USER_ID}/collection/my-list`)
      )
    })

    it("falls back to internalID when slug is null", () => {
      mountComponent({ ...mockEntity, private: false, slug: null })

      fireEvent.press(screen.getByText("Copy link"))

      expect(Clipboard.setString).toHaveBeenCalledWith(
        getShareURL(`/user/${CURRENT_USER_ID}/collection/coll-internalID`)
      )
    })
  })
})

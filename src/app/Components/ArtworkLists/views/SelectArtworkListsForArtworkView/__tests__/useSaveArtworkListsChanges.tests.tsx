import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkListsStore } from "app/Components/ArtworkLists/ArtworkListsStore"
import { ARTWORK_LISTS_STORE_INITIAL_STATE } from "app/Components/ArtworkLists/types"
import { useSaveArtworkListsChanges } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/useSaveArtworkListsChanges"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Text } from "react-native"
import { graphql } from "react-relay"

const artwork = {
  id: "artwork-id",
  internalID: "artwork-internal-id",
  title: "Some Artwork",
  isInAuction: false,
}

const addingArtworkLists = [
  { internalID: "custom-artwork-list-two", name: "Custom Artwork List 2" },
]

const SaveTrigger = () => {
  const { save } = useSaveArtworkListsChanges()
  return <Text onPress={save}>trigger-save</Text>
}

const resolveAddedToList = {
  ArtworksCollectionsBatchUpdateSuccess: () => ({
    addedToArtworkLists: [{ internalID: "custom-artwork-list-two", default: false }],
    removedFromArtworkLists: [],
  }),
}

describe("useSaveArtworkListsChanges", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => (
      <ArtworkListsStore.Provider
        runtimeModel={{
          state: { ...ARTWORK_LISTS_STORE_INITIAL_STATE, artwork, addingArtworkLists },
        }}
      >
        <SaveTrigger />
      </ArtworkListsStore.Provider>
    ),
    query: graphql`
      query useSaveArtworkListsChangesTestQuery @relay_test_operation {
        me {
          internalID
        }
      }
    `,
  })

  const getLastSavedList = () =>
    __globalStoreTestUtils__?.getCurrentState().lastSavedList.lastSavedList

  it("records the added list when ARDefaultToLastSavedList is enabled", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ ARDefaultToLastSavedList: true })

    const { mockResolveLastOperation } = renderWithRelay()

    fireEvent.press(screen.getByText("trigger-save"))
    mockResolveLastOperation(resolveAddedToList)

    expect(getLastSavedList()).toEqual({
      internalID: "custom-artwork-list-two",
      name: "Custom Artwork List 2",
      default: false,
    })
  })

  it("does not record the added list when ARDefaultToLastSavedList is disabled", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ ARDefaultToLastSavedList: false })

    const { mockResolveLastOperation } = renderWithRelay()

    fireEvent.press(screen.getByText("trigger-save"))
    mockResolveLastOperation(resolveAddedToList)

    expect(getLastSavedList()).toBeNull()
  })
})

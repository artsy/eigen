import { OwnerType } from "@artsy/cohesion"
import { fireEvent, waitFor } from "@testing-library/react-native"
import {
  SavedSearchModel,
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { ClearAllButton } from "app/Scenes/SavedSearchAlert/screens/SavedSearchFilterScreen"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Alert } from "react-native"

jest.spyOn(Alert, "alert")

describe("ClearAllButton", () => {
  it("Is enabled when there are active filters", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <ClearAllButton />
      </SavedSearchStoreProvider>
    )

    fireEvent(getByText("Clear All"), "onPress")

    waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled()
    })
  })

  it("Is disabled on load", async () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider
        runtimeModel={{
          ...initialData,
          attributes: {},
        }}
      >
        <ClearAllButton />
      </SavedSearchStoreProvider>
    )

    fireEvent(getByText("Clear All"), "onPress")

    waitFor(() => {
      expect(Alert.alert).not.toHaveBeenCalled()
    })
  })

  it("Is disabled when array attrbutes are empty", async () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider
        runtimeModel={{
          ...initialData,
          attributes: {
            attributionClass: [],
          },
        }}
      >
        <ClearAllButton />
      </SavedSearchStoreProvider>
    )

    fireEvent(getByText("Clear All"), "onPress")

    waitFor(() => {
      expect(Alert.alert).not.toHaveBeenCalled()
    })
  })
})

const initialData: SavedSearchModel = {
  ...savedSearchModel,
  attributes: {},
  entity: {
    artists: [{ id: "artistID", name: "Banksy" }],
    owner: {
      type: OwnerType.artist,
      id: "ownerId",
      slug: "ownerSlug",
    },
  },
}

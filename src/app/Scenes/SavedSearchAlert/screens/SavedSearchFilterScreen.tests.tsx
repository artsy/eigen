import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
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
  beforeEach(() => {
    ;(Alert.alert as jest.Mock).mockClear()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("Is enabled when there are active filters", async () => {
    renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <ClearAllButton />
      </SavedSearchStoreProvider>
    )

    fireEvent(screen.getByText("Clear All"), "onPress")

    expect(Alert.alert).toHaveBeenCalled()
  })

  it("Is disabled on load", async () => {
    renderWithWrappers(
      <SavedSearchStoreProvider
        runtimeModel={{
          ...initialData,
          attributes: {},
        }}
      >
        <ClearAllButton />
      </SavedSearchStoreProvider>
    )

    fireEvent(screen.getByText("Clear All"), "onPress")

    expect(Alert.alert).not.toHaveBeenCalled()
  })

  it("Is disabled when array attrbutes are empty", async () => {
    renderWithWrappers(
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

    fireEvent(screen.getByText("Clear All"), "onPress")

    expect(Alert.alert).not.toHaveBeenCalled()
  })
})

const initialData: SavedSearchModel = {
  ...savedSearchModel,
  attributes: {
    inquireableOnly: true,
    offerable: true,
  },
  entity: {
    artists: [{ id: "artistID", name: "Banksy" }],
    owner: {
      type: OwnerType.artist,
      id: "ownerId",
      slug: "ownerSlug",
    },
  },
}

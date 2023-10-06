import { fireEvent, waitFor } from "@testing-library/react-native"
import {
  NewArtworkFiltersStoreProvider,
  getNewArtworkFilterStoreModel,
} from "app/Components/NewArtworkFilter/NewArtworkFilterStore"
import { NewFilterParamName } from "app/Components/NewArtworkFilter/helpers"
import { ClearAllButton } from "app/Scenes/SavedSearchAlert/screens/AddFiltersScreen"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Alert } from "react-native"

jest.spyOn(Alert, "alert")

describe("ClearAllButton", () => {
  it("Is enabled when there are active filters", () => {
    const { getByText } = renderWithWrappers(
      <NewArtworkFiltersStoreProvider runtimeModel={initialData}>
        <ClearAllButton />
      </NewArtworkFiltersStoreProvider>
    )

    fireEvent(getByText("Clear All"), "onPress")

    waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled()
    })
  })

  it("Is disabled when there are no filters", async () => {
    const { getByText } = renderWithWrappers(
      <NewArtworkFiltersStoreProvider>
        <ClearAllButton />
      </NewArtworkFiltersStoreProvider>
    )

    fireEvent(getByText("Clear All"), "onPress")

    waitFor(() => {
      expect(Alert.alert).not.toHaveBeenCalled()
    })
  })
})

const initialData = {
  ...getNewArtworkFilterStoreModel(),
  selectedFilters: [
    {
      paramName: NewFilterParamName.attributionClass,
      paramValue: {
        value: "unique",
        displayLabel: "Unique",
      },
    },
    {
      paramName: NewFilterParamName.attributionClass,
      paramValue: {
        value: "limited edition",
        displayLabel: "Limited Edition",
      },
    },
  ],
}

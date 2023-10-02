import BottomSheet from "@gorhom/bottom-sheet"
import { fireEvent } from "@testing-library/react-native"
import { MyCollectionBottomSheetModalAdd } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalAdd"
import { MyCollectionTabsStoreProvider } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("MyCollectionBottomSheetModalAdd", () => {
  const TestRenderer = () => {
    return (
      <MyCollectionTabsStoreProvider injections={{ view: "Add" }}>
        <BottomSheet index={0} snapPoints={["50%"]}>
          <MyCollectionBottomSheetModalAdd />
        </BottomSheet>
      </MyCollectionTabsStoreProvider>
    )
  }

  describe("Add Artists", () => {
    it("navigates the user to add artists screen", () => {
      const { getByText } = renderWithWrappers(<TestRenderer />)

      const addArtistsButton = getByText("Add Artists")

      fireEvent(addArtistsButton, "onPress")

      // TODO: Add this test later
    })
  })

  describe("Add Artworks", () => {
    it("navigates the user to add artwork screen", () => {
      const { getByText } = renderWithWrappers(<TestRenderer />)

      const addArworksButton = getByText("Add Artworks")

      fireEvent(addArworksButton, "onPress")

      expect(navigate).toHaveBeenCalledWith("my-collection/artworks/new", {
        passProps: {
          source: Tab.collection,
        },
      })
    })
  })
})

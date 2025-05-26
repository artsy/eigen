import BottomSheet from "@gorhom/bottom-sheet"
import { fireEvent, screen } from "@testing-library/react-native"
import { MyCollectionBottomSheetModalAdd } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalAdd"
import { MyCollectionTabsStoreProvider } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { Tab } from "app/Scenes/MyCollection/MyCollection"
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
      renderWithWrappers(<TestRenderer />)

      const addArtistsButton = screen.getByText("Add Artists")

      fireEvent(addArtistsButton, "onPress")

      expect(navigate).toHaveBeenCalledWith("my-collection/collected-artists/new", {
        passProps: {
          source: Tab.collection,
        },
      })
    })
  })

  describe("Add Artworks", () => {
    it("navigates the user to add artwork screen", () => {
      renderWithWrappers(<TestRenderer />)

      const addArworksButton = screen.getByText("Add Artworks")

      fireEvent(addArworksButton, "onPress")

      expect(navigate).toHaveBeenCalledWith("my-collection/artworks/new", {
        passProps: {
          source: Tab.collection,
        },
      })
    })
  })
})

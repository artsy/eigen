import BottomSheet from "@gorhom/bottom-sheet"
import { fireEvent } from "@testing-library/react-native"
import { MyCollectionBottomSheetModalAdd } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalAdd"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { navigate, popToRoot } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("MyCollectionBottomSheetModalAdd", () => {
  const TestRenderer = () => {
    return (
      <BottomSheet index={0} snapPoints={["50%"]}>
        <MyCollectionBottomSheetModalAdd />
      </BottomSheet>
    )
  }

  describe("Add Artists", () => {
    it("navigates the user to add artists screen", () => {
      const { getByText } = renderWithWrappers(<TestRenderer />)

      const addArtistsButton = getByText("Add Artists")

      fireEvent(addArtistsButton, "onPress")

      // replace with the right mock
      // expect(console.log).toHaveBeenCalledWith("Add Artists")
    })
  })

  describe("Add Artworks", () => {
    it("navigates the user to add artwork screen", () => {
      const { getByText } = renderWithWrappers(<TestRenderer />)

      const addArworksButton = getByText("Add Artworks")

      fireEvent(addArworksButton, "onPress")

      // replace with the right mock
      expect(navigate).toHaveBeenCalledWith("my-collection/artworks/new", {
        passProps: {
          mode: "add",
          source: Tab.collection,
          onSuccess: popToRoot,
        },
      })
    })
  })
})

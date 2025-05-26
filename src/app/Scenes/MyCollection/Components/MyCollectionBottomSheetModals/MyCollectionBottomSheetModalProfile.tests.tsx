import BottomSheet from "@gorhom/bottom-sheet"
import { fireEvent, screen } from "@testing-library/react-native"
import { MyCollectionBottomSheetModalProfile } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalProfile"
import { MyCollectionTabsStoreProvider } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { Tab } from "app/Scenes/MyCollection/MyCollection"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("react-native/Libraries/Interaction/InteractionManager", () => ({
  ...jest.requireActual("react-native/Libraries/Interaction/InteractionManager"),
  runAfterInteractions: jest.fn((callback) => callback()),
}))

describe("MyCollectionBottomSheetModalProfile", () => {
  const TestRenderer = () => {
    return (
      <MyCollectionTabsStoreProvider injections={{ view: "Add" }}>
        <BottomSheet index={0} snapPoints={["50%"]}>
          <MyCollectionBottomSheetModalProfile isVisible={true} />
        </BottomSheet>
      </MyCollectionTabsStoreProvider>
    )
  }

  describe("Edit Profile", () => {
    it("navigates the user to edit profile screen", () => {
      renderWithWrappers(<TestRenderer />)

      const addArtistsButton = screen.getByText("Edit Profile")

      fireEvent(addArtistsButton, "onPress")

      expect(navigate).toHaveBeenCalledWith("/my-profile/edit")
    })
  })

  describe("Add Artists", () => {
    it("navigates the user to add artists screen", () => {
      renderWithWrappers(<TestRenderer />)

      const addArtistsButton = screen.getByText("Add Artist")

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

      const addArworksButton = screen.getByText("Add Artwork")

      fireEvent(addArworksButton, "onPress")

      expect(navigate).toHaveBeenCalledWith("my-collection/artworks/new", {
        passProps: {
          source: Tab.collection,
        },
      })
    })
  })
})

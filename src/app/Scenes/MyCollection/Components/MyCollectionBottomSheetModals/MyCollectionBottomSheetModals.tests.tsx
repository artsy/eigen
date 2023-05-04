import { MyCollectionBottomSheetModals } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModals"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("MyCollectionBottomSheetModals", () => {
  it("renders the right bottom sheet depending on the view specified", () => {
    const { getByText } = renderWithWrappers(<MyCollectionBottomSheetModals view="Add" />)
    expect(getByText("Add to My Collection")).toBeTruthy()
  })
})

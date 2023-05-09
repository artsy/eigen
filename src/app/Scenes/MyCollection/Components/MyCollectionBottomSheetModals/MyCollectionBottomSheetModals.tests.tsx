import {
  MyCollectionBottomSheetModalView,
  MyCollectionBottomSheetModals,
} from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModals"
import {
  MyCollectionTabsStoreProvider,
  myCollectionTabsStoreModel,
} from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("MyCollectionBottomSheetModals", () => {
  const TestRenderer: React.FC<{ view?: MyCollectionBottomSheetModalView }> = ({ view }) => (
    <MyCollectionTabsStoreProvider
      runtimeModel={{
        ...myCollectionTabsStoreModel,
        view: view ?? null,
      }}
    >
      <MyCollectionBottomSheetModals />
    </MyCollectionTabsStoreProvider>
  )

  it("renders nothing", () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)
    expect(() => getByText("Add to My Collection")).toThrow()
  })

  it("renders Add to my collection when the Add view is specified", () => {
    const { getByText } = renderWithWrappers(<TestRenderer view="Add" />)
    expect(getByText("Add to My Collection")).toBeTruthy()
  })
})

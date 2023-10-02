import {
  MyCollectionBottomSheetModalKind,
  MyCollectionBottomSheetModals,
} from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModals"
import {
  MyCollectionTabsStoreProvider,
  myCollectionTabsStoreModel,
} from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("MyCollectionBottomSheetModals", () => {
  const TestRenderer: React.FC<{ viewKind?: MyCollectionBottomSheetModalKind }> = ({
    viewKind,
  }) => (
    <MyCollectionTabsStoreProvider
      runtimeModel={{
        ...myCollectionTabsStoreModel,
        viewKind: viewKind ?? null,
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
    const { getByText } = renderWithWrappers(<TestRenderer viewKind="Add" />)
    expect(getByText("Add to My Collection")).toBeTruthy()
  })
})

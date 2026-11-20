import { screen } from "@testing-library/react-native"
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

  it("renders nothing", async () => {
    await renderWithWrappers(<TestRenderer />)
    expect(() => screen.getByText("Add to My Collection")).toThrow()
  })

  it("renders Add to my collection when the Add view is specified", async () => {
    await renderWithWrappers(<TestRenderer viewKind="Add" />)
    expect(screen.getByText("Add to My Collection")).toBeTruthy()
  })
})

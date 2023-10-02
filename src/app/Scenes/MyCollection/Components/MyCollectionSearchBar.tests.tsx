import { fireEvent } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { MyCollectionSearchBar, MyCollectionSearchBarProps } from "./MyCollectionSearchBar"

describe("MyCollectionSearchBar", () => {
  const defaultProps: MyCollectionSearchBarProps = {
    onChangeText: jest.fn(),
    searchString: "",
  }

  const renderWithStickyTabPage = (props: Partial<MyCollectionSearchBarProps> = {}) =>
    renderWithWrappers(<MyCollectionSearchBar {...defaultProps} {...props} />)

  it("renders input when clicking on the search bar text", () => {
    const { queryByTestId } = renderWithStickyTabPage({})

    expect(queryByTestId("MyCollectionSearchBarNoInputTouchable")).toBeDefined()

    fireEvent.press(queryByTestId("MyCollectionSearchBarNoInputTouchable")!)

    expect(queryByTestId("MyCollectionSearchBarInput")).toBeDefined()
    expect(queryByTestId("MyCollectionSearchBarInputCancelButton")).toBeDefined()
  })

  it("changes view option when clicking on view option icon", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({
      AREnableMyCollectionCollectedArtists: false,
      ARShowCollectedArtistOnboarding: true,
    })

    const { queryByTestId } = renderWithStickyTabPage()

    const listButton = queryByTestId("MyCollectionSearchListIconTouchable")
    const gridButton = queryByTestId("MyCollectionSearchGridIconTouchable")

    expect(__globalStoreTestUtils__?.getCurrentState().userPrefs.artworkViewOption).toEqual("grid")

    fireEvent(listButton!, "onPress")

    expect(__globalStoreTestUtils__?.getCurrentState().userPrefs.artworkViewOption).toEqual("list")

    fireEvent(gridButton!, "onPress")

    expect(__globalStoreTestUtils__?.getCurrentState().userPrefs.artworkViewOption).toEqual("grid")
  })
})

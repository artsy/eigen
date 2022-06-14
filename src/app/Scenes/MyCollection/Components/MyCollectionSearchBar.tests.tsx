import { fireEvent } from "@testing-library/react-native"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { MyCollectionSearchBar, MyCollectionSearchBarProps } from "./MyCollectionSearchBar"

describe("MyCollectionSearchBar", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableMyCollectionSearchBar: true })
  })

  const defaultProps: MyCollectionSearchBarProps = {
    onChangeText: jest.fn(),
    searchString: "",
  }

  const renderWithStickyTabPage = (props: Partial<MyCollectionSearchBarProps> = {}) =>
    renderWithWrappersTL(
      <StickyTabPage
        tabs={[
          {
            title: "My Collection",
            content: <MyCollectionSearchBar {...defaultProps} {...props} />,
          },
        ]}
      />
    )

  it("renders input when clicking on the search bar text", () => {
    const { queryByTestId } = renderWithStickyTabPage({})

    expect(queryByTestId("MyCollectionSearchBarNoInputTouchable")).toBeDefined()

    fireEvent.press(queryByTestId("MyCollectionSearchBarNoInputTouchable")!)

    expect(queryByTestId("MyCollectionSearchBarInput")).toBeDefined()
    expect(queryByTestId("MyCollectionSearchBarInputCancelButton")).toBeDefined()
  })

  it("changes view option when clicking on view option icon", () => {
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

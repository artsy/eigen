import { fireEvent } from "@testing-library/react-native"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { MyCollectionSearchBar, MyCollectionSearchBarProps } from "./MyCollectionSearchBar"

describe("MyCollectionSearchBar", () => {
  const defaultProps: MyCollectionSearchBarProps = {
    onChangeText: jest.fn(),
    searchString: "",
  }
  const wrapper = (props: MyCollectionSearchBarProps) =>
    renderWithWrappersTL(
      <StickyTabPage
        tabs={[
          {
            title: "My Collection",
            content: <MyCollectionSearchBar {...props} />,
          },
        ]}
      />
    )

  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableMyCollectionSearchBar: true })
  })

  describe("renders properly", () => {
    it("When isFocused is true", () => {
      const { queryByTestId } = wrapper({ ...defaultProps })
      expect(queryByTestId("MyCollectionSearchBarInput")).toBeDefined()
      expect(queryByTestId("MyCollectionSearchBarInputCancelButton")).toBeDefined()

      expect(queryByTestId("MyCollectionSearchBarNoInputTouchable")).toBe(null)
      expect(queryByTestId("MyCollectionSearchListIconTouchable")).toBe(null)
      expect(queryByTestId("MyCollectionSearchGridIconTouchable")).toBe(null)
    })

    it("When isFocused is false", () => {
      const { queryByTestId } = wrapper({ ...defaultProps })
      expect(queryByTestId("MyCollectionSearchBarNoInputTouchable")).toBeDefined()
      expect(queryByTestId("MyCollectionSearchListIconTouchable")).toBeDefined()
      expect(queryByTestId("MyCollectionSearchGridIconTouchable")).toBeDefined()
      expect(queryByTestId("MyCollectionSearchBarInput")).toBe(null)
      expect(queryByTestId("MyCollectionSearchBarInputCancelButton")).toBe(null)
    })
  })

  it("can switch from Grid to List and vice-versa", () => {
    const { queryByTestId } = wrapper({ ...defaultProps })
    expect(__globalStoreTestUtils__?.getCurrentState().userPrefs.artworkViewOption).toEqual("grid")
    const listIcon = queryByTestId("MyCollectionSearchListIconTouchable")
    const gridIcon = queryByTestId("MyCollectionSearchGridIconTouchable")
    fireEvent(listIcon!, "onPress")
    expect(__globalStoreTestUtils__?.getCurrentState().userPrefs.artworkViewOption).toEqual("list")
    fireEvent(gridIcon!, "onPress")
    expect(__globalStoreTestUtils__?.getCurrentState().userPrefs.artworkViewOption).toEqual("grid")
  })
})

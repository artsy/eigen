import { Route } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { useFormikContext } from "formik"
import React from "react"
import { Dimensions } from "../Components/Dimensions"
import { MediumPicker } from "../Components/MediumPicker"
import { ArtworkFormMode } from "../MyCollectionArtworkForm"
import { MyCollectionArtworkFormMain } from "./MyCollectionArtworkFormMain"

jest.mock("formik")

jest.mock("app/Components/FancyModal/FancyModalHeader", () => ({
  FancyModalHeader: () => null,
}))

jest.mock("../Components/ArtistAutosuggest", () => ({
  ArtistAutosuggest: () => null,
}))

jest.mock("../Components/MediumPicker", () => ({
  MediumPicker: () => null,
}))

jest.mock("../Components/MediumPicker", () => ({
  MediumPicker: () => null,
}))

jest.mock("../Components/Dimensions", () => ({
  Dimensions: () => null,
}))

const mockShowActionSheetWithOptions = jest.fn()

jest.mock("@expo/react-native-action-sheet", () => ({
  useActionSheet: () => ({ showActionSheetWithOptions: mockShowActionSheetWithOptions }),
}))

jest.mock("app/utils/requestPhotos", () => ({
  showPhotoActionSheet: jest.fn(() => Promise.resolve({ photos: [] })),
}))

describe("AddEditArtwork", () => {
  const useFormikContextMock = useFormikContext as jest.Mock
  const mockNav: Partial<StackNavigationProp<{}>> = {
    addListener: jest.fn(),
  }

  beforeEach(() => {
    useFormikContextMock.mockImplementation(() => ({
      handleSubmit: jest.fn(),
      handleBlur: jest.fn(),
      handleChange: jest.fn(),
      setFieldValue: jest.fn(),
      values: {
        photos: [],
      },
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
    __globalStoreTestUtils__?.reset()
  })

  it("renders correct components on Add", () => {
    const mockRoute: Route<
      "ArtworkFormMain",
      {
        mode: ArtworkFormMode
        clearForm(): void
        onDelete(): void
        onHeaderBackButtonPress(): void
      }
    > = {
      key: "ArtworkFormMain",
      name: "ArtworkFormMain",
      params: {
        mode: "add",
        clearForm: jest.fn(),
        onDelete: jest.fn(),
        onHeaderBackButtonPress: jest.fn(),
      },
    }
    const artworkForm = (
      <MyCollectionArtworkFormMain navigation={mockNav as any} route={mockRoute} />
    )
    const wrapper = renderWithWrappers(artworkForm)
    const expected = [FancyModalHeader, MediumPicker, Dimensions]
    expected.forEach((Component) => {
      expect(wrapper.root.findByType(Component as React.ComponentType)).toBeDefined()
    })

    // not exposed components
    expect(wrapper.root.findByProps({ testID: "CompleteButton" })).toBeDefined()
    expect(wrapper.root.findByProps({ testID: "PhotosButton" })).toBeDefined()
  })

  it("renders correct components on Edit", () => {
    const mockRoute: Route<
      "ArtworkFormMain",
      {
        mode: ArtworkFormMode
        clearForm(): void
        onDelete(): void
        onHeaderBackButtonPress(): void
      }
    > = {
      key: "ArtworkFormMain",
      name: "ArtworkFormMain",
      params: {
        mode: "edit",
        clearForm: jest.fn(),
        onDelete: jest.fn(),
        onHeaderBackButtonPress: jest.fn(),
      },
    }
    const artworkForm = (
      <MyCollectionArtworkFormMain navigation={mockNav as any} route={mockRoute} />
    )
    const wrapper = renderWithWrappers(artworkForm)
    const completeButton = wrapper.root.findByProps({ testID: "CompleteButton" })
    const deleteButton = wrapper.root.findByProps({ testID: "DeleteButton" })
    expect(completeButton).toBeDefined()
    expect(deleteButton).toBeDefined()
  })

  it("fires clear form on header Clear button click", () => {
    const mockClearForm = jest.fn()
    const mockRoute: Route<
      "ArtworkFormMain",
      {
        mode: ArtworkFormMode
        clearForm(): void
        onDelete(): void
        onHeaderBackButtonPress(): void
      }
    > = {
      key: "ArtworkFormMain",
      name: "ArtworkFormMain",
      params: {
        mode: "edit",
        clearForm: mockClearForm,
        onDelete: jest.fn(),
        onHeaderBackButtonPress: jest.fn(),
      },
    }
    const artworkForm = (
      <MyCollectionArtworkFormMain navigation={mockNav as any} route={mockRoute} />
    )
    // make form dirty
    __globalStoreTestUtils__?.injectState({
      myCollection: {
        artwork: {
          sessionState: {
            formValues: {
              width: "30",
            },
            dirtyFormCheckValues: {
              width: "40",
            },
          },
        },
      },
    })
    const wrapper = renderWithWrappers(artworkForm)
    wrapper.root.findByType(FancyModalHeader).props.onRightButtonPress()
    expect(mockClearForm).toHaveBeenCalled()
  })

  it("fires formik's handleSubmit on complete button click", () => {
    const spy = jest.fn()
    useFormikContextMock.mockImplementation(() => ({
      handleSubmit: spy,
      handleBlur: jest.fn(),
      handleChange: jest.fn(),
      setFieldValue: jest.fn(),
      values: {
        photos: [],
      },
    }))
    const mockRoute: Route<
      "ArtworkFormMain",
      {
        mode: ArtworkFormMode
        clearForm(): void
        onDelete(): void
        onHeaderBackButtonPress(): void
      }
    > = {
      key: "ArtworkFormMain",
      name: "ArtworkFormMain",
      params: {
        mode: "edit",
        clearForm: jest.fn(),
        onDelete: jest.fn(),
        onHeaderBackButtonPress: jest.fn(),
      },
    }
    const artworkForm = (
      <MyCollectionArtworkFormMain navigation={mockNav as any} route={mockRoute} />
    )
    const wrapper = renderWithWrappers(artworkForm)
    const completeButton = wrapper.root.findByProps({ testID: "CompleteButton" })
    completeButton.props.onPress()
    expect(spy).toHaveBeenCalled()
  })

  it("fires delete artwork action on delete button click", () => {
    const mockDelete = jest.fn()
    const mockRoute: Route<
      "ArtworkFormMain",
      {
        mode: ArtworkFormMode
        clearForm(): void
        onDelete(): void
        onHeaderBackButtonPress(): void
      }
    > = {
      key: "ArtworkFormMain",
      name: "ArtworkFormMain",
      params: {
        mode: "edit",
        clearForm: jest.fn(),
        onDelete: mockDelete,
        onHeaderBackButtonPress: jest.fn(),
      },
    }

    const artworkForm = (
      <MyCollectionArtworkFormMain navigation={mockNav as any} route={mockRoute} />
    )
    const wrapper = renderWithWrappers(artworkForm)
    const deleteButton = wrapper.root.findByProps({ testID: "DeleteButton" })
    deleteButton.props.onPress()
    expect(mockShowActionSheetWithOptions).toHaveBeenCalled()
    const callback = mockShowActionSheetWithOptions.mock.calls[0][1]
    callback(0) // confirm deletion
    expect(mockDelete).toHaveBeenCalledWith()
  })
})

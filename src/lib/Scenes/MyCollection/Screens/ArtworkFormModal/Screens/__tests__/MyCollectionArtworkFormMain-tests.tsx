import { Route } from "@react-navigation/native"
import { useFormikContext } from "formik"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { __appStoreTestUtils__ } from "lib/store/AppStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { ActionSheetIOS } from "react-native"
import { ArrowButton } from "../../Components/ArrowButton"
import { ArtistAutosuggest } from "../../Components/ArtistAutosuggest"
import { Dimensions } from "../../Components/Dimensions"
import { MediumPicker } from "../../Components/MediumPicker"
import { ArtworkFormMode } from "../../MyCollectionArtworkFormModal"
import { MyCollectionArtworkFormMain } from "../MyCollectionArtworkFormMain"

jest.mock("formik")

jest.mock("lib/Components/FancyModal/FancyModalHeader", () => ({
  FancyModalHeader: () => null,
}))

jest.mock("../../Components/ArtistAutosuggest", () => ({
  ArtistAutosuggest: () => null,
}))

jest.mock("../../Components/MediumPicker", () => ({
  MediumPicker: () => null,
}))

jest.mock("../../Components/MediumPicker", () => ({
  MediumPicker: () => null,
}))

jest.mock("../../Components/Dimensions", () => ({
  Dimensions: () => null,
}))

describe("AddEditArtwork", () => {
  const useFormikContextMock = useFormikContext as jest.Mock

  beforeEach(() => {
    useFormikContextMock.mockImplementation(() => ({
      handleSubmit: jest.fn(),
      values: {
        photos: [],
      },
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
    __appStoreTestUtils__?.reset()
  })

  it("renders correct components on Add", () => {
    const mockNav = jest.fn()
    const mockRoute: Route<
      "ArtworkForm",
      {
        mode: ArtworkFormMode
        onDismiss(): void
        onDelete?(): void
      }
    > = {
      key: "ArtworkForm",
      name: "ArtworkForm",
      params: {
        mode: "add",
        onDismiss: jest.fn(),
        onDelete: jest.fn(),
      },
    }
    const artworkForm = <MyCollectionArtworkFormMain navigation={mockNav as any} route={mockRoute} />
    const wrapper = renderWithWrappers(artworkForm)
    const expected = [FancyModalHeader, ArtistAutosuggest, MediumPicker, Dimensions]
    expected.forEach((Component) => {
      expect(wrapper.root.findByType(Component as React.ComponentType)).toBeDefined()
    })

    // not exposed components
    expect(wrapper.root.findByProps({ "data-test-id": "CompleteButton" })).toBeDefined()
    expect(wrapper.root.findByProps({ "data-test-id": "PhotosButton" })).toBeDefined()
    expect(wrapper.root.findByProps({ "data-test-id": "PhotosButton" })).toBeDefined()
  })

  it("renders correct components on Edit", () => {
    const mockNav = jest.fn()
    const mockRoute: Route<
      "ArtworkForm",
      {
        mode: ArtworkFormMode
        onDismiss(): void
        onDelete?(): void
      }
    > = {
      key: "ArtworkForm",
      name: "ArtworkForm",
      params: {
        mode: "edit",
        onDismiss: jest.fn(),
        onDelete: jest.fn(),
      },
    }
    const artworkForm = <MyCollectionArtworkFormMain navigation={mockNav as any} route={mockRoute} />
    const wrapper = renderWithWrappers(artworkForm)
    const completeButton = wrapper.root.findByProps({ "data-test-id": "CompleteButton" })
    const deleteButton = wrapper.root.findByProps({ "data-test-id": "DeleteButton" })
    expect(completeButton).toBeDefined()
    expect(deleteButton).toBeDefined()
  })

  it("fires dismiss on header cancel button click", () => {
    const mockNav = jest.fn()
    const mockDismiss = jest.fn()
    const mockRoute: Route<
      "ArtworkForm",
      {
        mode: ArtworkFormMode
        onDismiss(): void
        onDelete?(): void
      }
    > = {
      key: "ArtworkForm",
      name: "ArtworkForm",
      params: {
        mode: "edit",
        onDismiss: mockDismiss,
        onDelete: jest.fn(),
      },
    }
    const artworkForm = <MyCollectionArtworkFormMain navigation={mockNav as any} route={mockRoute} />
    const wrapper = renderWithWrappers(artworkForm)
    wrapper.root.findByType(FancyModalHeader).props.onLeftButtonPress()
    expect(mockDismiss).toHaveBeenCalled()
  })

  it("fires formik's handleSubmit on complete button click", () => {
    const spy = jest.fn()
    useFormikContextMock.mockImplementation(() => ({
      handleSubmit: spy,
      values: {
        photos: [],
      },
    }))
    const mockNav = jest.fn()
    const mockRoute: Route<
      "ArtworkForm",
      {
        mode: ArtworkFormMode
        onDismiss(): void
        onDelete?(): void
      }
    > = {
      key: "ArtworkForm",
      name: "ArtworkForm",
      params: {
        mode: "edit",
        onDismiss: jest.fn(),
        onDelete: jest.fn(),
      },
    }
    const artworkForm = <MyCollectionArtworkFormMain navigation={mockNav as any} route={mockRoute} />
    const wrapper = renderWithWrappers(artworkForm)
    const completeButton = wrapper.root.findByProps({ "data-test-id": "CompleteButton" })
    completeButton.props.onPress()
    expect(spy).toHaveBeenCalled()
  })

  it("fires delete artwork action on delete button click", () => {
    const mockDelete = jest.fn()
    const mockNav = jest.fn()
    const mockRoute: Route<
      "ArtworkForm",
      {
        mode: ArtworkFormMode
        onDismiss(): void
        onDelete?(): void
      }
    > = {
      key: "ArtworkForm",
      name: "ArtworkForm",
      params: {
        mode: "edit",
        onDismiss: jest.fn(),
        onDelete: mockDelete,
      },
    }

    const mockShowActionSheet = jest.fn()
    ActionSheetIOS.showActionSheetWithOptions = mockShowActionSheet

    const artworkForm = <MyCollectionArtworkFormMain navigation={mockNav as any} route={mockRoute} />
    const wrapper = renderWithWrappers(artworkForm)
    const deleteButton = wrapper.root.findByProps({ "data-test-id": "DeleteButton" })
    deleteButton.props.onPress()
    expect(mockShowActionSheet).toHaveBeenCalled()
    const callback = mockShowActionSheet.mock.calls[0][1]
    callback(0) // confirm deletion
    expect(mockDelete).toHaveBeenCalledWith()
  })

  it("navigates to additional details on click", () => {
    const mockNavigate = jest.fn()
    const mockNav = {
      navigate: mockNavigate,
    }
    const mockRoute: Route<
      "ArtworkForm",
      {
        mode: ArtworkFormMode
        onDismiss(): void
        onDelete?(): void
      }
    > = {
      key: "ArtworkForm",
      name: "ArtworkForm",
      params: {
        mode: "edit",
        onDismiss: jest.fn(),
        onDelete: jest.fn(),
      },
    }
    const artworkForm = <MyCollectionArtworkFormMain navigation={mockNav as any} route={mockRoute} />
    const wrapper = renderWithWrappers(artworkForm)
    wrapper.root.findByProps({ "data-test-id": "AdditionalDetailsButton" }).findByType(ArrowButton).props.onPress()
    expect(mockNavigate).toHaveBeenCalledWith("AdditionalDetails")
  })
})

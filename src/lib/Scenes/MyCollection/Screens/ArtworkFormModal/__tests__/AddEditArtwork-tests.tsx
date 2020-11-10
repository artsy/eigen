import { useFormikContext } from "formik"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { __appStoreTestUtils__, AppStore } from "lib/store/AppStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { AddEditArtwork, tests } from "../AddEditArtwork"
import { ArrowButton } from "../Components/ArrowButton"
import { ArtistAutosuggest } from "../Components/ArtistAutosuggest"
import { Dimensions } from "../Components/Dimensions"
import { MediumPicker } from "../Components/MediumPicker"

jest.mock("formik")

jest.mock("lib/Components/FancyModal/FancyModalHeader", () => ({
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

  it("renders correct components on Create", () => {
    const wrapper = renderWithWrappers(<AddEditArtwork />)
    const expected = [
      FancyModalHeader,
      ArtistAutosuggest,
      MediumPicker,
      Dimensions,
      tests.PhotosButton,
      tests.AdditionalDetailsButton,
    ]
    expected.forEach((Component) => {
      expect(wrapper.root.findByType(Component as React.ComponentType)).toBeDefined()
    })
    const CompleteButton = wrapper.root.findByProps({ "data-test-id": "CompleteButton" })
    expect(CompleteButton).toBeDefined()
  })

  it("renders correct components on Edit", () => {
    __appStoreTestUtils__?.injectState({ myCollection: { navigation: { sessionState: { modalType: "edit" } } } })
    const wrapper = renderWithWrappers(<AddEditArtwork />)
    const completeButton = wrapper.root.findByProps({ "data-test-id": "CompleteButton" })
    const deletetButtton = wrapper.root.findByProps({ "data-test-id": "DeleteButton" })
    expect(completeButton).toBeDefined()
    expect(deletetButtton).toBeDefined()
  })

  it("fires cancel action on header cancel button click", () => {
    const wrapper = renderWithWrappers(<AddEditArtwork />)
    const spy = jest.fn()
    AppStore.actions.myCollection.artwork.cancelAddEditArtwork = spy as any
    wrapper.root.findByType(FancyModalHeader).props.onLeftButtonPress()
    expect(spy).toHaveBeenCalled()
  })

  it("fires formik's handleSubmit on complete button click", () => {
    const spy = jest.fn()
    useFormikContextMock.mockImplementation(() => ({
      handleSubmit: spy,
      values: {
        photos: [],
      },
    }))
    const wrapper = renderWithWrappers(<AddEditArtwork />)
    const completeButton = wrapper.root.findByProps({ "data-test-id": "CompleteButton" })
    completeButton.props.onPress()
    expect(spy).toHaveBeenCalled()
  })

  it("fires delete artwork action on delete button click", () => {
    const deleteArgs = {
      artworkId: "someArtworkId",
      artworkGlobalId: "someArtworkGlobalId",
    }
    __appStoreTestUtils__?.injectState({
      myCollection: {
        artwork: {
          sessionState: {
            ...deleteArgs,
            formValues: {
              photos: [],
            },
          },
        },
        navigation: {
          sessionState: {
            modalType: "edit",
          },
        },
      },
    })

    const spy = jest.fn()
    AppStore.actions.myCollection.artwork.confirmDeleteArtwork = spy as any
    const wrapper = renderWithWrappers(<AddEditArtwork />)
    const deleteButton = wrapper.root.findByProps({ "data-test-id": "DeleteButton" })
    deleteButton.props.onPress()
    expect(spy).toHaveBeenCalledWith(expect.objectContaining(deleteArgs))
  })

  it("navigates to additional details on click", () => {
    const spy = jest.fn()
    AppStore.actions.myCollection.navigation.navigateToAddAdditionalDetails = spy as any
    const wrapper = renderWithWrappers(<AddEditArtwork />)
    wrapper.root.findByType(tests.AdditionalDetailsButton).findByType(ArrowButton).props.onPress()
    expect(spy).toHaveBeenCalled()
  })
})

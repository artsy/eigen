import { fireEvent } from "@testing-library/react-native"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { Photo } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/validation"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { RelayEnvironmentProvider } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { PhotoRow } from "./PhotoRow"

jest.unmock("react-relay")

const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>
const mockHandlePhotoDelete = jest.fn()

describe("PhotoRow", () => {
  describe("when passed an uploaded photo", () => {
    const TestRenderer = () => (
      <RelayEnvironmentProvider environment={mockEnvironment}>
        <PhotoRow photo={mockUploadedPhoto} onPhotoDelete={mockHandlePhotoDelete} progress={0.4} />
      </RelayEnvironmentProvider>
    )

    beforeEach(() => mockEnvironment.mockClear())

    it("renders photo as a thumbnail", () => {
      const { getByTestId } = renderWithWrappersTL(<TestRenderer />)
      expect(getByTestId("Submission_Image")).toBeTruthy()
    })

    it("renders photo size", () => {
      const { getByText } = renderWithWrappersTL(<TestRenderer />)
      expect(getByText("3.3 MB")).toBeTruthy()
    })

    it("renders Delete button", () => {
      const { getByTestId } = renderWithWrappersTL(<TestRenderer />)
      expect(getByTestId("Submission_Delete_Photo_Button")).toBeTruthy()
    })

    it("fires handlePhotoDelete with correct photo when Delete button pressed", () => {
      const { getByTestId } = renderWithWrappersTL(<TestRenderer />)
      const DeleteButton = getByTestId("Submission_Delete_Photo_Button")

      act(() => fireEvent.press(DeleteButton))

      expect(mockHandlePhotoDelete).toHaveBeenCalled()
      expect(mockHandlePhotoDelete).toHaveBeenCalledWith(mockUploadedPhoto)
    })
  })

  describe("when passed a photo with error", () => {
    const TestRenderer = () => (
      <RelayEnvironmentProvider environment={mockEnvironment}>
        <PhotoRow photo={mockPhotoWithError} onPhotoDelete={mockHandlePhotoDelete} progress={0.4} />
      </RelayEnvironmentProvider>
    )

    beforeEach(() => mockEnvironment.mockClear())

    it("renders correct error message", () => {
      const { getByText } = renderWithWrappersTL(<TestRenderer />)
      expect(getByText("some error")).toBeTruthy()
    })
  })
})

const mockUploadedPhoto: Photo = {
  id: "123",
  geminiToken: "abc",
  height: 100,
  width: 100,
  path: "myPhotos/photo.jpeg",
  loading: false,
  error: false,
  sizeDisplayValue: "3.3 MB",
}
const mockPhotoWithError: Photo = {
  id: "123",
  geminiToken: "abc",
  height: 100,
  width: 100,
  path: "myPhotos/photo.jpeg",
  loading: false,
  error: true,
  errorMessage: "some error",
  sizeDisplayValue: "3.3 MB",
}

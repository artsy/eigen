import { fireEvent, screen } from "@testing-library/react-native"
import { PhotoRow } from "app/Components/PhotoRow/PhotoRow"
import { Photo } from "app/Components/PhotoRow/utils/validation"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { RelayEnvironmentProvider } from "react-relay"

const mockEnvironment = getMockRelayEnvironment()
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
      renderWithWrappers(<TestRenderer />)
      expect(screen.getByTestId("Submission_Image")).toBeTruthy()
    })

    it("renders photo size", () => {
      renderWithWrappers(<TestRenderer />)
      expect(screen.getByText("3.3 MB")).toBeTruthy()
    })

    it("renders Delete button", () => {
      renderWithWrappers(<TestRenderer />)
      expect(screen.getByTestId("Submission_Delete_Photo_Button")).toBeTruthy()
    })

    it("fires handlePhotoDelete with correct photo when Delete button pressed", () => {
      renderWithWrappers(<TestRenderer />)
      const DeleteButton = screen.getByTestId("Submission_Delete_Photo_Button")

      fireEvent.press(DeleteButton)

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
      renderWithWrappers(<TestRenderer />)
      expect(screen.getByText("some error")).toBeTruthy()
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

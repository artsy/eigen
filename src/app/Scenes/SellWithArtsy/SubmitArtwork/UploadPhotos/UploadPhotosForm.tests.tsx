import { fireEvent, screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useFormikContext } from "formik"
import { UploadPhotosForm } from "./UploadPhotosForm"

jest.mock("formik")

const mockShowActionSheetWithOptionsMock = jest.fn()
jest.mock("@expo/react-native-action-sheet", () => ({
  useActionSheet: () => ({ showActionSheetWithOptions: mockShowActionSheetWithOptionsMock }),
}))

const useFormikContextMock = useFormikContext as jest.Mock

describe("UploadPhotosForm", () => {
  beforeEach(() => {
    useFormikContextMock.mockImplementation(() => ({
      handleSubmit: jest.fn(),
      handleChange: jest.fn(),
      setFieldValue: jest.fn(),
      values: {
        photos: [],
      },
    }))
  })

  afterEach(() => jest.clearAllMocks())

  it("renders correct explanation messages", () => {
    renderWithWrappers(<UploadPhotosForm />)
    expect(screen.getByText("Add Photos")).toBeTruthy()
  })

  it("renders Add Photos button", () => {
    renderWithWrappers(<UploadPhotosForm />)
    expect(screen.getByTestId("Submission_Add_Photos_Button")).toBeTruthy()
  })

  it("when Add Photos pressed, opens up native action sheet for user to select photos", async () => {
    renderWithWrappers(<UploadPhotosForm />)
    const AddPhotoButton = screen.getByTestId("Submission_Add_Photos_Button")
    fireEvent.press(AddPhotoButton)
    expect(mockShowActionSheetWithOptionsMock).toHaveBeenCalled()
  })
})

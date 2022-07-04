import { fireEvent } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { useFormikContext } from "formik"
import { UploadPhotosForm } from "./UploadPhotosForm"

jest.mock("formik")
jest.unmock("react-relay")

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
    const { getByText } = renderWithWrappers(<UploadPhotosForm />)
    expect(getByText("Add Files Here")).toBeTruthy()
    expect(getByText("Files Supported: JPG, PNG, HEIC")).toBeTruthy()
    expect(getByText("Total Maximum Size: 30MB")).toBeTruthy()
  })

  it("renders Add Photos button", () => {
    const { getByTestId } = renderWithWrappers(<UploadPhotosForm />)
    expect(getByTestId("Submission_Add_Photos_Button")).toBeTruthy()
  })

  it("when Add Photos pressed, opens up native action sheet for user to select photos", async () => {
    const { getByTestId } = renderWithWrappers(<UploadPhotosForm />)
    const AddPhotoButton = getByTestId("Submission_Add_Photos_Button")
    fireEvent.press(AddPhotoButton)
    expect(mockShowActionSheetWithOptionsMock).toHaveBeenCalled()
  })
})

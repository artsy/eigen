import { useFormikContext } from "formik"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { ArtworkDetailsForm } from "./ArtworkDetailsForm"
import { mockFormValues } from "./utils/testUtils"

jest.unmock("react-relay")
jest.mock("formik")

const useFormikContextMock = useFormikContext as jest.Mock

describe("ArtworkDetailsForm", () => {
  beforeEach(() => {
    useFormikContextMock.mockImplementation(() => ({
      handleSubmit: jest.fn(),
      handleChange: jest.fn(),
      setFieldValue: jest.fn(),
      errors: {},
      values: mockFormValues,
    }))
  })

  afterEach(() => jest.clearAllMocks())

  it("Validation", async () => {
    const { findByText } = renderWithWrappersTL(<ArtworkDetailsForm />)
    expect(findByText("hello")).toBeTruthy()
  })
})

// describe("validation", () => {
//   it("keeps Save & Continue button disabled until all required fields validated", async () => {
//     const { getByTestId, UNSAFE_getByProps } = renderWithWrappersTL(<TestRenderer />)

//     const SaveButton = UNSAFE_getByProps({
//       testID: "Submission_ArtworkDetails_Button",
//     })

//     const inputs = {
//       title: getByTestId("Submission_TitleInput"),
//       year: getByTestId("Submission_YearInput"),
//       material: getByTestId("Submission_MaterialsInput"),
//       height: getByTestId("Submission_HeightInput"),
//       width: getByTestId("Submission_WidthInput"),
//       depth: getByTestId("Submission_DepthInput"),
//       provenance: getByTestId("Submission_ProvenanceInput"),
//     }

//     await flushPromiseQueue()

//     // title missing
//     act(() => fireEvent.changeText(inputs.title, ""))
//     expect(SaveButton.props.disabled).toBe(true)

//     // year missing
//     act(() => {
//       fireEvent.changeText(inputs.year, "")
//       fireEvent.changeText(inputs.title, "someTitle")
//     })
//     expect(SaveButton.props.disabled).toBe(true)

//     // material missing
//     act(() => {
//       fireEvent.changeText(inputs.material, "")
//       fireEvent.changeText(inputs.year, "1999")
//     })
//     expect(SaveButton.props.disabled).toBe(true)

//     // height missing
//     act(() => {
//       fireEvent.changeText(inputs.height, "")
//       fireEvent.changeText(inputs.material, "oil on c")
//     })
//     expect(SaveButton.props.disabled).toBe(true)

//     // width missing
//     act(() => {
//       fireEvent.changeText(inputs.width, "")
//       fireEvent.changeText(inputs.height, "123")
//     })
//     expect(SaveButton.props.disabled).toBe(true)

//     // depth missing
//     act(() => {
//       fireEvent.changeText(inputs.depth, "")
//       fireEvent.changeText(inputs.width, "123")
//     })

//     expect(SaveButton.props.disabled).toBe(true)

//     // provenance missing
//     act(() => {
//       fireEvent.changeText(inputs.provenance, "")
//       fireEvent.changeText(inputs.depth, "123")
//     })

//     expect(SaveButton.props.disabled).toBe(true)

//     act(() => {
//       fireEvent.changeText(inputs.provenance, "found it")
//     })
//   })
// })

import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { ConsignmentInquiryForm } from "./ConsignmentInquiryForm"

const initialValues = {
  name: "tester name",
  email: "email@hq.com",
  phoneNumber: "+4912345",
  message: "",
}

jest.mock("formik", () => ({
  useFormikContext: () => {
    return {
      values: initialValues,
      handleChange: jest.fn(() => jest.fn()),
      errors: {},
      isValid: true,
    }
  },
}))

describe("ConsignmentInquiryForm", () => {
  const getWrapper = () =>
    renderWithWrappers(<ConsignmentInquiryForm canPopScreen confirmLeaveEdit={jest.fn} />)
  it("renders with fields prepopulated", () => {
    const tree = getWrapper()
    const nameInput = tree.getByTestId("swa-inquiry-name-input")
    const emailInput = tree.getByTestId("swa-inquiry-email-input")
    const phoneInput = tree.getByTestId("swa-inquiry-phone-input")
    expect(nameInput.props.value).toBe(initialValues.name)
    expect(emailInput.props.value).toBe(initialValues.email)
    expect(phoneInput.props.value).toBe("12 345") // excluding area code and spaced
  })
})

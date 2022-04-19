import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { RequestForPriceEstimateForm } from "./RequestForPriceEstimateForm"

const initialValues = {
  requesterName: "tester name",
  requesterEmail: "email@hq.com",
  requesterPhoneNumber: "+4912345",
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

describe("RequestForPriceEstimateForm", () => {
  const getWrapper = () => renderWithWrappersTL(<RequestForPriceEstimateForm />)
  it("renders with fields prepopulated", () => {
    const tree = getWrapper()
    const nameInput = tree.getByTestId("request-price-estimate-name-input")
    const emailInput = tree.getByTestId("request-price-estimate-email-input")
    const phoneInput = tree.getByTestId("request-price-estimate-phone-input")
    expect(nameInput.props.value).toBe(initialValues.requesterName)
    expect(emailInput.props.value).toBe(initialValues.requesterEmail)
    expect(phoneInput.props.value).toBe("12 345") // excluding area code and spaced
  })
})

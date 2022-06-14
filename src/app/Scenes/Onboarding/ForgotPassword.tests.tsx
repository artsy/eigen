import { mockNavigate } from "app/tests/navigationMocks"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Input } from "palette"
import React from "react"
import { act } from "react-test-renderer"
import { ForgotPasswordForm } from "./ForgotPassword"

const navigationPropsMock = {
  navigate: mockNavigate,
  goBack: jest.fn(),
}

const mockHandleSubmit = jest.fn()
const mockValidateForm = jest.fn()

jest.mock("formik", () => ({
  useFormikContext: () => {
    return {
      handleSubmit: mockHandleSubmit,
      values: { email: "" },
      handleChange: jest.fn(() => jest.fn()),
      validateForm: mockValidateForm,
      errors: {},
      isValid: true,
      dirty: false,
      isSubmitting: false,
    }
  },
}))

describe("ForgotPassword", () => {
  const TestProvider = () => {
    return (
      <ForgotPasswordForm
        requestedPasswordReset={false}
        navigation={navigationPropsMock as any}
        route={null as any}
      />
    )
  }

  it("renders reset button disabled initially", () => {
    const tree = renderWithWrappers(<TestProvider />)
    const resetButton = tree.root.findByProps({ testID: "resetButton" })
    expect(resetButton.props.disabled).toEqual(true)
  })

  it("validates form on blur", () => {
    const tree = renderWithWrappers(<TestProvider />)

    const emailInput = tree.root.findByType(Input)

    act(() => {
      emailInput.props.onChangeText("example@mail.com")
      emailInput.props.onBlur()
    })

    expect(mockValidateForm).toHaveBeenCalled()
  })
})

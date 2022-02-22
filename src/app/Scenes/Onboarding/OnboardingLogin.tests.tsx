import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Input, Touchable } from "palette"
import React from "react"
import { OnboardingLoginWithEmailForm } from "./OnboardingLogin"

const navigateMock = jest.fn()

const navigationPropsMock = {
  navigate: navigateMock,
  goBack: jest.fn(),
}

const mockHandleSubmit = jest.fn()
const mockValidateForm = jest.fn()

jest.mock("formik", () => ({
  useFormikContext: () => {
    return {
      handleSubmit: mockHandleSubmit,
      values: { mail: "", password: "" },
      handleChange: jest.fn(() => jest.fn()),
      validateForm: mockValidateForm,
      errors: {},
      isValid: true,
      dirty: false,
      isSubmitting: false,
    }
  },
}))

describe("OnboardingLogin", () => {
  const TestProvider = ({ email = "" }) => {
    return (
      <OnboardingLoginWithEmailForm
        navigation={navigationPropsMock as any}
        route={{ params: { email } } as any}
      />
    )
  }

  describe("Forget Button", () => {
    it("navigates to forgot password screen", () => {
      const tree = renderWithWrappers(<TestProvider />)
      const forgotPasswordButton = tree.root.findAllByType(Touchable)[0]
      forgotPasswordButton.props.onPress()
      expect(navigateMock).toHaveBeenCalledWith("ForgotPassword")
    })
  })

  describe("Log in button", () => {
    it("renders disabled on screen mount", () => {
      const tree = renderWithWrappers(<TestProvider />)
      const loginButton = tree.root.findAllByProps({ testID: "loginButton" })[0]
      expect(loginButton.props.disabled).toEqual(true)
    })
    it("renders disabled when the user set only the email address", () => {
      const tree = renderWithWrappers(<TestProvider />)
      const emailInput = tree.root.findAllByType(Input)[0]
      emailInput.props.onChangeText("test@artsymail.com")
      const loginButton = tree.root.findAllByProps({ testID: "loginButton" })[0]
      expect(loginButton.props.disabled).toEqual(true)
    })
    it("renders disabled when the user sets only the password input", () => {
      const tree = renderWithWrappers(<TestProvider />)
      const passwordInput = tree.root.findAllByType(Input)[1]
      passwordInput.props.onChangeText("password")
      const loginButton = tree.root.findAllByProps({ testID: "loginButton" })[0]
      expect(loginButton.props.disabled).toEqual(true)
    })

    it("renders enabled when a valid email and password are there", () => {
      const tree = renderWithWrappers(<TestProvider />)
      const emailInput = tree.root.findAllByType(Input)[0]
      const passwordInput = tree.root.findAllByType(Input)[1]

      emailInput.props.onChangeText("example@mail.com")
      passwordInput.props.onChangeText("password")

      const loginButton = tree.root.findAllByProps({ testID: "loginButton" })[0]
      expect(loginButton.props.disabled).toEqual(true)
    })
  })

  describe("Form", () => {
    it("validates email on blur and onSubmitEditing", () => {
      const tree = renderWithWrappers(<TestProvider />)
      const emailInput = tree.root.findAllByType(Input)[0]

      emailInput.props.onChangeText("invalidEmail 1")
      emailInput.props.onBlur()
      expect(mockValidateForm).toHaveBeenCalled()

      emailInput.props.onChangeText("invalidEmail 2")
      emailInput.props.onSubmitEditing()
      expect(mockValidateForm).toHaveBeenCalled()
    })

    it("validates password on blur and onSubmitEditing", () => {
      const tree = renderWithWrappers(<TestProvider />)
      const passwordInput = tree.root.findAllByType(Input)[1]

      passwordInput.props.onChangeText("password 1")
      passwordInput.props.onBlur()
      expect(mockValidateForm).toHaveBeenCalled()

      passwordInput.props.onChangeText("password 2")
      passwordInput.props.onSubmitEditing()
      expect(mockValidateForm).toHaveBeenCalled()
    })
  })

  describe("autoFocus", () => {
    it("is on the email input by default", () => {
      const tree = renderWithWrappers(<TestProvider />)
      const emailInput = tree.root.findAllByType(Input)[0]
      const passwordInput = tree.root.findAllByType(Input)[1]

      expect(emailInput.props.autoFocus).toBe(true)
      expect(passwordInput.props.autoFocus).toBe(false)
    })

    it("is on the password input when the email navigation param is set", () => {
      const tree = renderWithWrappers(<TestProvider email="test@email.com" />)
      const emailInput = tree.root.findAllByType(Input)[0]
      const passwordInput = tree.root.findAllByType(Input)[1]

      expect(emailInput.props.autoFocus).toBe(false)
      expect(passwordInput.props.autoFocus).toBe(true)
    })
  })
})

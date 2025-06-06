import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { OnboardingLoginWithEmailForm } from "app/Scenes/Onboarding/OnboardingLogin"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"

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

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("navigates to forgot password screen", () => {
    renderWithHookWrappersTL(<TestProvider />)

    fireEvent.press(screen.getByText("Forgot password?"))

    expect(navigateMock).toHaveBeenCalledWith("ForgotPassword")
  })

  it("button remains disabled given a form in a blank state", () => {
    renderWithHookWrappersTL(<TestProvider />)

    expect(screen.getByTestId("loginButton").props.accessibilityState.disabled).toBe(true)
  })

  it("button remains disabled given a form with only email", () => {
    renderWithHookWrappersTL(<TestProvider />)

    fireEvent.changeText(screen.getByTestId("email-address"), "test@artsymail.com")

    expect(screen.getByTestId("loginButton").props.accessibilityState.disabled).toBe(true)
  })

  it("button remains disabled given a form with only password", () => {
    renderWithHookWrappersTL(<TestProvider />)

    fireEvent.changeText(screen.getByTestId("password"), "123456")

    expect(screen.getByTestId("loginButton").props.accessibilityState.disabled).toBe(true)
  })

  it("button is enabled given a form with email and password", () => {
    renderWithHookWrappersTL(<TestProvider />)

    fireEvent.changeText(screen.getByTestId("email-address"), "test@artsymail.com")
    fireEvent(screen.getByTestId("email-address"), "blur")
    fireEvent.changeText(screen.getByTestId("password"), "123456")
    fireEvent(screen.getByTestId("password"), "blur")

    waitFor(() => {
      expect(screen.getByTestId("loginButton").props.accessibilityState.disabled).toBe(false)
    })
  })

  it("validates email on blur and onSubmitEditing", () => {
    renderWithHookWrappersTL(<TestProvider />)

    fireEvent.changeText(screen.getByTestId("email-address"), "invalidEmail 1")
    fireEvent(screen.getByTestId("email-address"), "blur")
    expect(mockValidateForm).toHaveBeenCalledTimes(1)

    fireEvent.changeText(screen.getByTestId("email-address"), "invalidEmail 2")
    fireEvent(screen.getByTestId("email-address"), "submitEditing")
    expect(mockValidateForm).toHaveBeenCalledTimes(2)
  })

  it("validates password on blur and onSubmitEditing", () => {
    renderWithHookWrappersTL(<TestProvider />)

    fireEvent.changeText(screen.getByTestId("password"), "password 1")
    fireEvent(screen.getByTestId("password"), "blur")
    expect(mockValidateForm).toHaveBeenCalledTimes(1)

    fireEvent.changeText(screen.getByTestId("password"), "password 2")
    fireEvent(screen.getByTestId("password"), "submitEditing")
    waitFor(() => {
      expect(mockValidateForm).toHaveBeenCalledTimes(2)
    })
  })

  it("does not submit the form given a submission in an empty form state", () => {
    renderWithHookWrappersTL(<TestProvider />)

    fireEvent(screen.getByTestId("email-address"), "submitEditing")
    fireEvent(screen.getByTestId("password"), "submitEditing")

    // email submitEditing triggers the validation but not password
    expect(mockValidateForm).toHaveBeenCalledTimes(1)
  })

  it("autoFocus on email input by default", () => {
    renderWithHookWrappersTL(<TestProvider />)

    expect(screen.getByTestId("email-address").props.autoFocus).toBe(true)
    expect(screen.getByTestId("password").props.autoFocus).toBe(false)
  })

  it("autoFocus on email given email navigation param", () => {
    renderWithHookWrappersTL(<TestProvider email="test@email.com" />)

    expect(screen.getByTestId("email-address").props.autoFocus).toBe(false)
    expect(screen.getByTestId("password").props.autoFocus).toBe(true)
  })
})

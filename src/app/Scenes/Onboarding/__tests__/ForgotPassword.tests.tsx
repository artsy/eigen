import { fireEvent, screen } from "@testing-library/react-native"
import { ForgotPasswordForm } from "app/Scenes/Onboarding/ForgotPasswordForm"
import { mockNavigate } from "app/utils/tests/navigationMocks"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"

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

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders reset button disabled initially", () => {
    renderWithHookWrappersTL(<TestProvider />)

    expect(screen.getByTestId("resetButton").props.accessibilityState.disabled).toEqual(true)
  })

  it("validates form on blur", () => {
    renderWithHookWrappersTL(<TestProvider />)

    const emailInput = screen.getByTestId("email-address")

    fireEvent.changeText(emailInput, "example@mail.com")
    fireEvent(emailInput, "blur")

    expect(mockValidateForm).toHaveBeenCalled()
  })

  it("does not submit when onSubmitEditing if the form is not dirty", () => {
    renderWithHookWrappersTL(<TestProvider />)

    fireEvent(screen.getByTestId("email-address"), "submitEditing")

    expect(mockValidateForm).not.toHaveBeenCalled()
  })
})

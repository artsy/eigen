import { OnboardingLoginWithOTPForm, OTPMode } from "app/Scenes/Onboarding/OnboardingLoginWithOTP"
import { mockNavigate } from "app/utils/tests/navigationMocks"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

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

describe("OnboardingLoginWithOTPTests", () => {
  const TestProvider = (mode: OTPMode) => {
    return (
      <OnboardingLoginWithOTPForm
        otpMode={mode}
        navigation={navigationPropsMock as any}
        route={null as any}
      />
    )
  }

  describe("on demand requests", () => {
    it("shows a message when requesting an on demand code", () => {
      const testProvider = TestProvider("on_demand")
      const { queryByTestId } = renderWithWrappers(testProvider)
      expect(queryByTestId("on_demand_message")).not.toBeNull()
    })

    it("doesn't show a message for standard flow", () => {
      const testProvider = TestProvider("standard")
      const { queryByTestId } = renderWithWrappers(testProvider)
      expect(queryByTestId("on_demand_message")).toBeNull()
    })
  })
})

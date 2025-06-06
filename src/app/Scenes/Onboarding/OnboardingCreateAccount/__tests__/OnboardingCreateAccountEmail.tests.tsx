import { fireEvent, screen } from "@testing-library/react-native"
import {
  emailSchema,
  UserSchema,
} from "app/Scenes/Onboarding/OnboardingCreateAccount/OnboardingCreateAccount"
import { OnboardingCreateAccountEmail } from "app/Scenes/Onboarding/OnboardingCreateAccount/OnboardingCreateAccountEmail"
import { BackButton } from "app/system/navigation/BackButton"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { FormikProvider, useFormik } from "formik"

const navigateToWelcomeScreenMock = jest.fn()
const onSubmitMock = jest.fn()

describe("OnboardingCreateAccountEmail", () => {
  const Test: React.FC<{ email?: string }> = ({ email = "" }) => {
    const formik = useFormik<UserSchema>({
      enableReinitialize: true,
      validateOnChange: false,
      validateOnBlur: true,
      initialValues: { email, password: "", name: "" },
      initialErrors: {},
      onSubmit: onSubmitMock,
      validationSchema: emailSchema,
    })

    return (
      <FormikProvider value={formik}>
        <OnboardingCreateAccountEmail
          route={{ params: { navigateToWelcomeScreen: navigateToWelcomeScreenMock } } as any}
          navigation={null as any}
        />
      </FormikProvider>
    )
  }

  describe("Backbutton", () => {
    it("navigates back to the onboading welcome screen", () => {
      renderWithWrappers(<Test />)

      const backButton = screen.UNSAFE_getByType(BackButton)
      fireEvent.press(backButton)

      expect(navigateToWelcomeScreenMock).toHaveBeenCalled()
    })
  })

  describe("Form", () => {
    it("does not validate email when the user is still typing", () => {
      renderWithWrappers(<Test />)
      const emailInput = screen.getByTestId("emailInput")

      fireEvent.changeText(emailInput, "test")

      expect(emailInput).not.toHaveProp("error")
    })

    it("does validate the email on submit", async () => {
      renderWithWrappers(<Test />)
      const emailInput = screen.getByTestId("emailInput")
      expect(screen.queryByText("Please provide a valid email address")).not.toBeOnTheScreen()

      fireEvent.changeText(emailInput, "test")
      fireEvent(emailInput, "submitEditing")

      await flushPromiseQueue()

      expect(screen.getByText("Please provide a valid email address")).toBeOnTheScreen()
    })

    it("hides the error message when the user types", async () => {
      renderWithWrappers(<Test />)
      const emailInput = screen.getByTestId("emailInput")

      fireEvent.changeText(emailInput, "test")
      fireEvent(emailInput, "submitEditing")

      await flushPromiseQueue()

      expect(screen.getByText("Please provide a valid email address")).toBeOnTheScreen()

      fireEvent.changeText(emailInput, "test@email.com")
      fireEvent(emailInput, "submitEditing")

      await flushPromiseQueue()

      expect(screen.queryByText("Please provide a valid email address")).not.toBeOnTheScreen()
    })
  })
})

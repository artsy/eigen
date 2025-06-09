import { fireEvent, screen } from "@testing-library/react-native"
import {
  passwordSchema,
  UserSchema,
} from "app/Scenes/Onboarding/OnboardingCreateAccount/OnboardingCreateAccount"
import { OnboardingCreateAccountPassword } from "app/Scenes/Onboarding/OnboardingCreateAccount/OnboardingCreateAccountPassword"
import { BackButton } from "app/system/navigation/BackButton"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { FormikProvider, useFormik } from "formik"

const goBackMock = jest.fn()

const navigationMock = {
  goBack: goBackMock,
}

const onSubmitMock = jest.fn()

describe("OnboardingCreateAccountPassword", () => {
  const Test: React.FC<{ password?: string }> = ({ password = "" }) => {
    const formik = useFormik<UserSchema>({
      enableReinitialize: true,
      validateOnChange: false,
      validateOnBlur: true,
      initialValues: { email: "", password, name: "" },
      initialErrors: {},
      onSubmit: onSubmitMock,
      validationSchema: passwordSchema,
    })

    return (
      <FormikProvider value={formik}>
        <OnboardingCreateAccountPassword route={null as any} navigation={navigationMock as any} />
      </FormikProvider>
    )
  }

  describe("Backbutton", () => {
    it("navigates back to the password screen", () => {
      renderWithWrappers(<Test />)

      const backButton = screen.UNSAFE_getByType(BackButton)
      fireEvent.press(backButton)

      expect(goBackMock).toHaveBeenCalled()
    })
  })

  describe("Form", () => {
    it("does not validate password when the user is still typing", () => {
      renderWithWrappers(<Test />)
      const passwordInput = screen.getByTestId("passwordInput")

      fireEvent.changeText(passwordInput, "wrongpassword")

      expect(passwordInput).not.toHaveProp("error")
    })

    it("does validate the password properly on submit", async () => {
      renderWithWrappers(<Test />)
      const passwordInput = screen.getByTestId("passwordInput")

      fireEvent.changeText(passwordInput, "short")
      fireEvent(passwordInput, "submitEditing")

      await flushPromiseQueue()

      expect(screen.getByText("Your password should be at least 8 characters")).toBeOnTheScreen()

      fireEvent.changeText(passwordInput, "missing1uppercase")
      fireEvent(passwordInput, "submitEditing")

      await flushPromiseQueue()

      expect(
        screen.getByText("Your password should contain at least one uppercase letter")
      ).toBeOnTheScreen()

      fireEvent.changeText(passwordInput, "Nodigits")
      fireEvent(passwordInput, "submitEditing")

      await flushPromiseQueue()
      expect(screen.getByText("Your password should contain at least one digit"))

      fireEvent.changeText(passwordInput, "MISSING1LOWERCASE")
      fireEvent(passwordInput, "submitEditing")

      await flushPromiseQueue()

      expect(screen.getByText("Your password should contain at least one lowercase letter"))

      fireEvent.changeText(passwordInput, "")
      fireEvent(passwordInput, "submitEditing")

      await flushPromiseQueue()
      expect(screen.getByText("Password field is required"))
    })
  })
})

import { fireEvent, screen } from "@testing-library/react-native"
import {
  FormikSchema,
  nameSchema,
} from "app/Scenes/Onboarding/OnboardingCreateAccount/OnboardingCreateAccount"
import { OnboardingCreateAccountName } from "app/Scenes/Onboarding/OnboardingCreateAccount/OnboardingCreateAccountName"
import { BackButton } from "app/system/navigation/BackButton"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { FormikProvider, useFormik } from "formik"

const goBackMock = jest.fn()

const navigationMock = {
  goBack: goBackMock,
}
const onSubmitMock = jest.fn()

describe("OnboardingCreateAccountName", () => {
  const Test: React.FC<{
    name?: string
    acceptedTerms?: boolean
    agreedToReceiveEmails?: boolean
  }> = ({ name = "", acceptedTerms = false, agreedToReceiveEmails = false }) => {
    const formik = useFormik<FormikSchema>({
      enableReinitialize: true,
      validateOnChange: false,
      validateOnBlur: true,
      initialValues: {
        email: "",
        password: "",
        name,
        acceptedTerms,
        agreedToReceiveEmails,
      },
      initialErrors: {},
      onSubmit: onSubmitMock,
      validationSchema: nameSchema,
    })

    return (
      <FormikProvider value={formik}>
        <OnboardingCreateAccountName route={null as any} navigation={navigationMock as any} />
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
    it("does not submit when the user did not accept the terms and conditions", async () => {
      renderWithWrappers(<Test />)
      const nameInput = screen.getByTestId("nameInput")

      fireEvent.changeText(nameInput, "Andy warhol")
      fireEvent(nameInput, "submitEditing")

      await flushPromiseQueue()
      expect(onSubmitMock).not.toBeCalled()
    })

    it("submits when the user did accepts the terms and conditions", async () => {
      renderWithWrappers(<Test name="Andy warhol" acceptedTerms />)
      const nameInput = screen.getByTestId("nameInput")

      fireEvent(nameInput, "submitEditing")

      await flushPromiseQueue()
      expect(onSubmitMock).toBeCalled()
    })
  })

  describe("Checkboxes", () => {
    it("sets acceptedTerms to true when the user presses on the checkbox", async () => {
      renderWithWrappers(<Test name="Andy warhol" />)
      const termsCheckbox = screen.getByLabelText("Accept terms and privacy policy checkbox")

      fireEvent(termsCheckbox, "setChecked")

      expect(termsCheckbox).toBeChecked()
    })

    it("sets agreedToReceiveEmails to true when the user presses on the checkbox", async () => {
      renderWithWrappers(<Test name="Andy warhol" />)

      const emailsSubscriptionCheckbox = screen.getByLabelText(
        "Agree to receive Artsy's emails checkbox"
      )
      fireEvent(emailsSubscriptionCheckbox, "setChecked")

      expect(emailsSubscriptionCheckbox).toBeChecked()
    })
  })
})

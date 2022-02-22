import { BackButton } from "app/navigation/BackButton"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { FormikProvider, useFormik } from "formik"
import React from "react"
import { EmailSubscriptionCheckbox } from "./EmailSubscriptionCheckbox"
import { FormikSchema, nameSchema } from "./OnboardingCreateAccount"
import { OnboardingCreateAccountName } from "./OnboardingCreateAccountName"
import { TermsOfServiceCheckbox } from "./TermsOfServiceCheckbox"

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
      const tree = renderWithWrappers(<Test />)

      const backButton = tree.root.findAllByType(BackButton)[0]
      backButton.props.onPress()
      expect(goBackMock).toHaveBeenCalled()
    })
  })

  describe("Form", () => {
    it("renders the right name from the formik context", () => {
      const tree = renderWithWrappers(<Test name="Andy warhol" />)
      const input = tree.root.findByProps({ testID: "nameInput" })
      expect(input.props.value).toEqual("Andy warhol")
    })

    it("does not submit when the user did not accept the terms and conditions", async () => {
      const tree = renderWithWrappers(<Test name="Andy warhol" />)
      const input = tree.root.findByProps({ testID: "nameInput" })
      input.props.onSubmitEditing()
      await flushPromiseQueue()
      expect(onSubmitMock).not.toBeCalled()
    })

    it("submits when the user did accepts the terms and conditions", async () => {
      const tree = renderWithWrappers(<Test name="Andy warhol" acceptedTerms />)
      const input = tree.root.findByProps({ testID: "nameInput" })
      input.props.onSubmitEditing()
      await flushPromiseQueue()
      expect(onSubmitMock).toBeCalled()
    })
  })

  describe("Checkboxes", () => {
    it("sets acceptedTerms to true when the user presses on the checkbox", async () => {
      const tree = renderWithWrappers(<Test name="Andy warhol" />)
      const termsCheckbox = tree.root.findByType(TermsOfServiceCheckbox)
      termsCheckbox.props.setChecked()
      await flushPromiseQueue()
      expect(termsCheckbox.props.checked).toEqual(true)
    })
    it("sets agreedToReceiveEmails to true when the user presses on the checkbox", async () => {
      const tree = renderWithWrappers(<Test name="Andy warhol" />)
      const emailsSubscriptionCheckbox = tree.root.findByType(EmailSubscriptionCheckbox)
      emailsSubscriptionCheckbox.props.setChecked()
      await flushPromiseQueue()
      expect(emailsSubscriptionCheckbox.props.checked).toEqual(true)
    })
  })
})

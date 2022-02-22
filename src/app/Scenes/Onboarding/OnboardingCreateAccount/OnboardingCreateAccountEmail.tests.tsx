import { BackButton } from "app/navigation/BackButton"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { FormikProvider, useFormik } from "formik"
import { Input } from "palette"
import React from "react"
import { emailSchema, UserSchema } from "./OnboardingCreateAccount"
import { OnboardingCreateAccountEmail } from "./OnboardingCreateAccountEmail"

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
      const tree = renderWithWrappers(<Test />)

      const backButton = tree.root.findAllByType(BackButton)[0]
      backButton.props.onPress()
      expect(navigateToWelcomeScreenMock).toHaveBeenCalled()
    })
  })

  describe("Form", () => {
    it("renders the right email from the formik context", () => {
      const tree1 = renderWithWrappers(<Test />)
      const input1 = tree1.root.findAllByType(Input)[0]
      expect(input1.props.value).toEqual("")

      const tree2 = renderWithWrappers(<Test email="test@email.com" />)
      const input2 = tree2.root.findAllByType(Input)[0]
      expect(input2.props.value).toEqual("test@email.com")
    })

    it("does not validate email when the user is still typing", () => {
      const tree = renderWithWrappers(<Test />)
      const input = tree.root.findByProps({ testID: "emailInput" })
      input.props.onChangeText("test")
      expect(input.props.error).toEqual(undefined)
    })

    it("does validate the email on submit", async () => {
      const tree = renderWithWrappers(<Test />)
      const input = tree.root.findByProps({ testID: "emailInput" })
      input.props.onChangeText("test")
      input.props.onSubmitEditing()
      await flushPromiseQueue()
      expect(input.props.error).toEqual("Please provide a valid email address")
    })

    it("hides the error message when the user types", async () => {
      const tree = renderWithWrappers(<Test />)
      const input = tree.root.findByProps({ testID: "emailInput" })
      input.props.onChangeText("test")
      input.props.onSubmitEditing()
      await flushPromiseQueue()
      expect(input.props.error).toEqual("Please provide a valid email address")

      input.props.onChangeText("test2")
      await flushPromiseQueue()
      expect(input.props.error).toEqual(undefined)
    })
  })
})

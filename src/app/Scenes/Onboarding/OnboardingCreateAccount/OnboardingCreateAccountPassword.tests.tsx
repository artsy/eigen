import { BackButton } from "app/navigation/BackButton"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { FormikProvider, useFormik } from "formik"
import React from "react"
import { passwordSchema, UserSchema } from "./OnboardingCreateAccount"
import { OnboardingCreateAccountPassword } from "./OnboardingCreateAccountPassword"

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
      const tree = renderWithWrappers(<Test />)

      const backButton = tree.root.findAllByType(BackButton)[0]
      backButton.props.onPress()
      expect(goBackMock).toHaveBeenCalled()
    })
  })

  describe("Form", () => {
    it("renders the right password from the formik context", () => {
      const tree1 = renderWithWrappers(<Test />)
      const input1 = tree1.root.findByProps({ testID: "passwordInput" })
      expect(input1.props.value).toEqual("")

      const tree2 = renderWithWrappers(<Test password="1ValidPassword" />)
      const input2 = tree2.root.findByProps({ testID: "passwordInput" })
      expect(input2.props.value).toEqual("1ValidPassword")
    })

    it("does not validate password when the user is still typing", () => {
      const tree = renderWithWrappers(<Test />)
      const input = tree.root.findByProps({ testID: "passwordInput" })
      input.props.onChangeText("wrongpassword")
      expect(input.props.error).toEqual(undefined)
    })

    it("does validate the password properly on submit", async () => {
      const tree = renderWithWrappers(<Test />)
      const input = tree.root.findByProps({ testID: "passwordInput" })
      input.props.onChangeText("short")
      input.props.onSubmitEditing()
      await flushPromiseQueue()
      expect(input.props.error).toEqual("Your password should be at least 8 characters")

      input.props.onChangeText("missing1uppercase")
      input.props.onSubmitEditing()
      await flushPromiseQueue()
      expect(input.props.error).toEqual(
        "Your password should contain at least one uppercase letter"
      )

      input.props.onChangeText("Nodigits")
      input.props.onSubmitEditing()
      await flushPromiseQueue()
      expect(input.props.error).toEqual("Your password should contain at least one digit")

      input.props.onChangeText("MISSING1LOWERCASE")
      input.props.onSubmitEditing()
      await flushPromiseQueue()
      expect(input.props.error).toEqual(
        "Your password should contain at least one lowercase letter"
      )

      input.props.onChangeText("")
      input.props.onSubmitEditing()
      await flushPromiseQueue()
      expect(input.props.error).toEqual("Password field is required")
    })
  })
})

import { FormikProvider, useFormik } from "formik"
import { BackButton } from "lib/navigation/BackButton"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { nameSchema, UserSchema } from "../OnboardingCreateAccount"
import { OnboardingCreateAccountName } from "../OnboardingCreateAccountName"

const goBackMock = jest.fn()

const navigationMock = {
  goBack: goBackMock,
}
const onSubmitMock = jest.fn()

describe("OnboardingCreateAccountName", () => {
  const Test: React.FC<{ name?: string }> = ({ name = "" }) => {
    const formik = useFormik<UserSchema>({
      enableReinitialize: true,
      validateOnChange: false,
      validateOnBlur: true,
      initialValues: { email: "", password: "", name },
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
  })
})

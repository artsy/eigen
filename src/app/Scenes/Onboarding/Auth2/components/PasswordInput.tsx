import { Input, useTheme } from "@artsy/palette-mobile"
import { LoginPasswordStepFormValues } from "app/Scenes/Onboarding/Auth2/scenes/LoginPasswordStep"
import { SignUpPasswordStepFormValues } from "app/Scenes/Onboarding/Auth2/scenes/SignUpPasswordStep"
import { FormikContextType, useFormikContext } from "formik"
import { forwardRef } from "react"

export const PasswordInput = forwardRef<Input>((_props, ref) => {
  const {
    dirty,
    errors,
    handleChange,
    handleSubmit,
    validateForm,
    values,
  }: FormikContextType<LoginPasswordStepFormValues | SignUpPasswordStepFormValues> =
    useFormikContext<LoginPasswordStepFormValues | SignUpPasswordStepFormValues>()

  const { color } = useTheme()

  return (
    <Input
      autoCapitalize="none"
      autoComplete="password"
      autoCorrect={false}
      blurOnSubmit={false}
      error={errors.password}
      placeholderTextColor={color("black30")}
      ref={ref}
      returnKeyType="done"
      secureTextEntry
      // textContentType="oneTimeCode"
      // We need to to set textContentType to password here
      // enable autofill of login details from the device keychain.
      textContentType="password"
      testID="password"
      title="Password"
      value={values.password}
      onChangeText={(text) => {
        handleChange("password")(text)
      }}
      onSubmitEditing={() => {
        if (dirty && !!values.password) {
          handleSubmit()
        }
      }}
      onBlur={validateForm}
    />
  )
})

import { Input, useTheme } from "@artsy/palette-mobile"
import { LoginPasswordStepFormValues } from "app/Scenes/Onboarding/Auth2/scenes/LoginPasswordStep"
import { SignUpPasswordStepFormValues } from "app/Scenes/Onboarding/Auth2/scenes/SignUpPasswordStep"
import { FormikContextType, useFormikContext } from "formik"

interface PasswordInputProps {
  ref: React.RefObject<Input>
}

export const PasswordInput = <
  T extends LoginPasswordStepFormValues | SignUpPasswordStepFormValues,
>({
  ref,
}: PasswordInputProps) => {
  const {
    dirty,
    errors,
    handleChange,
    handleSubmit,
    setErrors,
    touched,
    validateForm,
    values,
  }: FormikContextType<T> = useFormikContext<T>()

  const { color } = useTheme()

  return (
    <Input
      autoCapitalize="none"
      autoComplete="password"
      autoCorrect={false}
      blurOnSubmit={false}
      error={
        values.password.length > 0 || touched.password
          ? (errors.password as string | undefined)
          : undefined
      }
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
        // Hide error when the user starts to type again
        if (errors.password) {
          setErrors({
            password: undefined,
          })
          validateForm()
        }
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
}

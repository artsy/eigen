import { BackButton, Button, Flex, Text, useTheme } from "@artsy/palette-mobile"
import { BottomSheetScrollView, useBottomSheet } from "@gorhom/bottom-sheet"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { useRecaptcha } from "app/Components/Recaptcha/Recaptcha"
import { useAuthNavigation } from "app/Scenes/Onboarding/Auth2/hooks/useAuthNavigation"
import { GlobalStore } from "app/store/GlobalStore"
import { FormikProvider, useFormik, useFormikContext } from "formik"
import { useEffect } from "react"
import { Alert } from "react-native"
import * as Yup from "yup"

interface EmailStepFormValues {
  email: string
  recaptchaToken: string | null
}

export const EmailStep: React.FC = () => {
  const navigation = useAuthNavigation()

  const formik = useFormik<EmailStepFormValues>({
    initialValues: { email: "", recaptchaToken: null },
    onSubmit: async ({ email, recaptchaToken }, { setFieldValue }) => {
      if (!recaptchaToken) {
        Alert.alert("Something went wrong. Please try again, or contact support@artsy.net")
        return
      }

      const res = await GlobalStore.actions.auth.verifyUser({ email, recaptchaToken })

      setFieldValue("recaptchaToken", null)

      if (res === "user_exists") {
        navigation.navigate("LoginPasswordStep", { email })
      } else if (res === "user_does_not_exist") {
        navigation.navigate("SignUpPasswordStep", { email })
      } else if (res === "something_went_wrong") {
        Alert.alert("Something went wrong. Please try again, or contact support@artsy.net")
      }
    },
    validateOnMount: false,
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Please provide a valid email address")
        .required("Email field is required"),
    }),
  })

  return (
    <BottomSheetScrollView>
      <FormikProvider value={formik}>
        <EmailStepForm />
      </FormikProvider>
    </BottomSheetScrollView>
  )
}

const EmailStepForm: React.FC = () => {
  const { errors, handleChange, handleSubmit, isValid, setFieldValue } =
    useFormikContext<EmailStepFormValues>()

  const navigation = useAuthNavigation()
  // const bottomSheet = useBottomSheet()

  const { Recaptcha, token } = useRecaptcha({ source: "authentication", action: "verify_email" })

  const { color, space } = useTheme()

  // TODO: reset recaptchaToken when the user navigates back
  useEffect(() => {
    setFieldValue("recaptchaToken", token)
  }, [setFieldValue, token])

  const handleBackButtonPress = () => {
    navigation.goBack()
    setTimeout(() => {
      // bottomSheet.snapToIndex(0)
    }, 50)
  }

  return (
    <Flex padding={2} gap={space(1)}>
      <BackButton onPress={handleBackButtonPress} />

      <Text variant="sm-display">Sign up or log in</Text>
      <Recaptcha />

      <BottomSheetInput
        autoCapitalize="none"
        autoComplete="email"
        autoFocus={true}
        keyboardType="email-address"
        onChangeText={(text) => {
          handleChange("email")(text.trim())
        }}
        blurOnSubmit={false} // This is needed to avoid UI jump when the user submits
        placeholderTextColor={color("black30")}
        title="Email"
        returnKeyType="next"
        spellCheck={false}
        autoCorrect={false}
        // We need to to set textContentType to username (instead of emailAddress) here
        // enable autofill of login details from the device keychain.
        textContentType="username"
        error={errors.email}
      />

      <Button block width={100} onPress={handleSubmit} disabled={!isValid}>
        Continue
      </Button>
    </Flex>
  )
}

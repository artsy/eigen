import { useNavigation, useRoute } from "@react-navigation/native"
import * as Yup from "yup"
import { FormikProvider, useFormik } from "formik"
import { Button, Flex, Input, Spacer, Text, Touchable } from "palette"
import React from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { GlobalStore } from "lib/store/GlobalStore"
import { StackScreenProps } from "@react-navigation/stack"
import { OnboardingNavigationStack } from "./Onboarding"
import { BackButton } from "lib/navigation/BackButton"

const NAVBAR_HEIGHT = 44

interface OnboardingSocialLinkFormSchema {
  password: string
}

export const OnboardingSocialLink: React.FC = () => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const { email } = useRoute<StackScreenProps<OnboardingNavigationStack, "OnboardingSocialLink">["route"]>().params ?? {
    email: "this.should.be.removed@artsymail.com",
  }

  const formik = useFormik<OnboardingSocialLinkFormSchema>({
    initialValues: { password: "" },
    initialErrors: {},
    validationSchema: Yup.object().shape({
      password: Yup.string().test("password", "Password field is required", (value) => value !== ""),
    }),
    onSubmit: async ({ password }, { setStatus, validateForm }) => {
      await validateForm()
      const verified = await GlobalStore.actions.auth.verifyPassword({ email, password })
      if (!verified) {
        await validateForm()
        setStatus("Incorrect password")
        return
      }
      // sign in
      // await GlobalStore.actions.auth.linkAccount({ email })
      // then go to home
    },
  })
  const { values, status, setStatus, isValid, dirty, handleSubmit, errors, handleChange } = formik

  return (
    <FormikProvider value={formik}>
      <Flex flex={1} backgroundColor="white100">
        <Flex mt={insets.top} height={NAVBAR_HEIGHT} flexDirection="row" alignItems="center" px={2}>
          <BackButton onPress={() => navigation.goBack()} />
        </Flex>
        <Flex flex={1} px={2} mb={insets.bottom}>
          <Text variant="lg">Link Accounts</Text>
          <Spacer mt={0.5} />
          <Text variant="xs">{`You already have an account ${email}`}.</Text>
          <Text variant="xs">
            Please enter your artsy.net password to link your account. You will need to do this once.
          </Text>
          <Spacer mt={2} />

          <Input
            title="Artsy Password"
            secureTextEntry
            autoFocus
            autoCapitalize="none"
            autoCompleteType="password"
            autoCorrect={false}
            onChangeText={(text) => {
              setStatus(undefined)
              handleChange("password")(text)
            }}
            onSubmitEditing={handleSubmit}
            blurOnSubmit={false}
            clearButtonMode="while-editing"
            placeholder="Password"
            returnKeyType="go"
            textContentType="password"
            value={values.password}
            error={status ?? errors.password}
            testID="artsyPasswordInput"
          />
          <Spacer mt={2} />
          <Touchable onPress={() => navigation.navigate("ForgotPassword", { email })}>
            <Text variant="sm" color="black60" style={{ textDecorationLine: "underline" }}>
              Forgot password?
            </Text>
          </Touchable>
          <Spacer mt={4} />

          <Button block disabled={!(isValid && dirty)} onPress={handleSubmit}>
            Link Accounts
          </Button>
          <Spacer mt="2" />
          <Button
            block
            variant="outline"
            onPress={() => {
              // do it
            }}
          >
            Continue with a Separate Account
          </Button>
        </Flex>
      </Flex>
    </FormikProvider>
  )
}

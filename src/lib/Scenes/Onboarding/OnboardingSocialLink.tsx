import { useNavigation, useRoute } from "@react-navigation/native"
import * as Yup from "yup"
import { FormikProvider, useFormik } from "formik"
import { Button, ChevronIcon, CloseIcon, Flex, Input, Spacer, Text, Touchable } from "palette"
import { Wrap } from "lib/utils/Wrap"
import React, { FC } from "react"
import { ScrollView, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { GlobalStore } from "lib/store/GlobalStore"
import { StackScreenProps } from "@react-navigation/stack"
import { OnboardingNavigationStack } from "./Onboarding"

interface BackButtonProps {
  onPress?: () => void
  showX?: boolean
}
const BackButton: FC<BackButtonProps> = ({ onPress, showX = false }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {showX ? <CloseIcon fill="black100" width={26} height={26} /> : <ChevronIcon direction="left" />}
    </TouchableOpacity>
  )
}

const NAVBAR_HEIGHT = 44
const EmptyHeader = () => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  return (
    <Flex mt={insets.top} height={NAVBAR_HEIGHT} flexDirection="row" alignItems="center" px={2}>
      <BackButton onPress={() => navigation.goBack()} />
    </Flex>
  )
}

interface ScreenBodyProps {
  scroll?: boolean
  safe?: boolean
}
const ScreenBody: FC<ScreenBodyProps> = ({ scroll = false, safe = false, children }) => {
  const insets = useSafeAreaInsets()
  return (
    <Flex flex={1} px={2} mb={safe ? insets.bottom : undefined}>
      <Wrap if={scroll} with={(c) => <ScrollView>{c}</ScrollView>}>
        {children}
      </Wrap>
    </Flex>
  )
}

const Screen: FC = ({ children }) => {
  return (
    <Flex flex={1} backgroundColor="white100">
      {children}
    </Flex>
  )
}

interface OnboardingSocialLinkFormSchema {
  password: string
}

export const OnboardingSocialLink: React.FC = () => {
  const navigation = useNavigation()
  const formik = useFormik<OnboardingSocialLinkFormSchema>({
    enableReinitialize: true,
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
    },
  })
  const { values, status, setStatus, isValid, dirty, handleSubmit, errors, handleChange } = formik

  return (
    <FormikProvider value={formik}>
      <Screen>
        <EmptyHeader />
        <ScreenBody scroll>
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
          <Spacer y={4} />

          <Button block disabled={!(isValid && dirty)} onPress={handleSubmit}>
            Link Accounts
          </Button>
          <Spacer y="2" />
          <Button
            block
            variant="outline"
            onPress={() => {
            }}
          >
            Continue with a Separate Account
          </Button>
        </ScreenBody>
      </Screen>
    </FormikProvider>
  )
}

import { BackButton, Button, Flex, LinkText, Text, useTheme } from "@artsy/palette-mobile"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { OnboardingStore } from "app/Scenes/Onboarding/OnboardingStore"
import { navigate } from "app/system/navigation/navigate"
import { Field, Formik } from "formik"
import React, { useRef } from "react"
import { Image, View } from "react-native"
import * as Yup from "yup"

export const AuthenticationDialog: React.FC = () => {
  const currentStep = OnboardingStore.useStoreState((state) => state.currentStep)
  const stepForward = OnboardingStore.useStoreActions((actions) => actions.stepForward)
  const stepBackward = OnboardingStore.useStoreActions((actions) => actions.stepBackward)

  const bottomSheetRef = useRef<BottomSheet>(null)

  const { space } = useTheme()

  const handleEmailInputFocus = () => {
    stepForward()
  }

  const handleBackButtonPress = () => {
    stepBackward()
  }

  const handleContinueButtonPress = () => {
    stepForward()
  }

  const emailValidationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
  })

  const passwordValidationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[\W_]/, "Password must contain at least one special character")
      .required("Password is required"),
  })

  return (
    <View style={{ flex: 1 }}>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["100%"]}
        detached
        enableContentPanningGesture={false}
        handleComponent={null}
      >
        <BottomSheetScrollView>
          <Flex padding={2} gap={space(1)}>
            <Formik
              initialValues={{ email: "", password: "" }}
              onSubmit={handleContinueButtonPress}
              validationSchema={
                currentStep === "EmailStep" ? emailValidationSchema : passwordValidationSchema
              }
              validateOnMount
            >
              {({ handleBlur, handleChange, handleSubmit, isValid, values }) => (
                <>
                  {(currentStep === "EmailStep" || currentStep === "LoginPasswordStep") && (
                    <BackButton onPress={handleBackButtonPress} />
                  )}
                  {(currentStep === "WelcomeStep" || currentStep === "EmailStep") && (
                    <Text variant="sm-display">Sign up or log in</Text>
                  )}
                  {currentStep === "LoginPasswordStep" && (
                    <Text variant="sm-display">Welcome back to Artsy</Text>
                  )}
                  {(currentStep === "WelcomeStep" || currentStep === "EmailStep") && (
                    <Field
                      name="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      keyboardType="email-address"
                      spellCheck={false}
                      autoCorrect={false}
                      component={BottomSheetInput}
                      onFocus={handleEmailInputFocus}
                      onBlur={handleBlur("email")}
                      placeholder="Enter your email address"
                      returnKeyType="done"
                      title="Email"
                      value={values.email}
                      onChangeText={handleChange("email")}
                    />
                  )}
                  {currentStep === "LoginPasswordStep" && (
                    <Field
                      name="password"
                      autoCapitalize="none"
                      autoComplete="current-password"
                      autoCorrect={false}
                      secureTextEntry
                      component={BottomSheetInput}
                      placeholder="Enter your password"
                      returnKeyType="done"
                      title="Password"
                      value={values.password}
                      onChangeText={handleChange("password")}
                    />
                  )}
                  {currentStep === "WelcomeStep" && (
                    <Flex gap={space(1)}>
                      <Text variant="xs" textAlign="center">
                        Or continue with
                      </Text>
                      <Flex flexDirection="row" justifyContent="space-evenly">
                        <Flex>
                          <Image source={require("images/apple.webp")} resizeMode="contain" />
                        </Flex>
                        <Flex>
                          <Image source={require("images/google.webp")} resizeMode="contain" />
                        </Flex>
                        <Flex>
                          <Image source={require("images/facebook.webp")} resizeMode="contain" />
                        </Flex>
                      </Flex>
                    </Flex>
                  )}
                  {currentStep === "WelcomeStep" && (
                    <Text variant="xxs" color="black60" textAlign="center">
                      By tapping Continue with Apple, Facebook, or Google, you agree to Artsy’s{" "}
                      <LinkText variant="xxs" onPress={() => navigate("/terms")}>
                        Terms of Use
                      </LinkText>{" "}
                      and{" "}
                      <LinkText variant="xxs" onPress={() => navigate("/privacy")}>
                        Privacy Policy
                      </LinkText>
                    </Text>
                  )}
                  {(currentStep === "EmailStep" || currentStep === "LoginPasswordStep") && (
                    <Button block width={100} onPress={handleSubmit} disabled={!isValid}>
                      Continue
                    </Button>
                  )}
                </>
              )}
            </Formik>
          </Flex>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  )
}

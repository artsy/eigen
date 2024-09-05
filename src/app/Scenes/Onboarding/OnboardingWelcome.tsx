import {
  Spacer,
  useTheme,
  ArtsyLogoWhiteIcon,
  Flex,
  Text,
  LegacyScreen,
  LinkText,
  BackButton,
  Button,
} from "@artsy/palette-mobile"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import {
  ArtsyNativeModule,
  DEFAULT_NAVIGATION_BAR_COLOR,
} from "app/NativeModules/ArtsyNativeModule"
import { navigate } from "app/system/navigation/navigate"
import { useScreenDimensions } from "app/utils/hooks"
import { Field, Formik } from "formik"
import backgroundImage from "images/WelcomeImage.webp"
import { MotiView, View } from "moti"
import { useEffect, useRef, useState } from "react"
import { Dimensions, Image, Platform } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import * as Yup from "yup"
import { OnboardingNavigationStack } from "./Onboarding"

type OnboardingWelcomeProps = StackScreenProps<OnboardingNavigationStack, "OnboardingWelcome">

const imgProps = Image.resolveAssetSource(backgroundImage)

export const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({ navigation }) => {
  const { space } = useTheme()
  const { width: screenWidth } = useScreenDimensions()
  // useScreenDimensions() returns the window height instead of the screen
  // We need the entire screen height here because the background image should fill
  // the entire screen including drawing below the navigation bar
  const { height: screenHeight } = Dimensions.get("screen")

  // background sliding
  const translateX = useSharedValue(0)
  const slideAnim = useAnimatedStyle(() => {
    "worklet"
    return { transform: [{ translateX: translateX.value }] }
  })
  useEffect(() => {
    // We want to animate the background only when the device width is smaller than the scaled image width
    const imgScale = imgProps.height / screenHeight
    const imgWidth = imgProps.width * imgScale
    // animate the background only when the device width is smaller than the scaled image width
    if (screenWidth < imgWidth) {
      const rightMarginFirstStop = 120
      const rightMarginSecondStop = 320
      translateX.value = withSequence(
        withTiming(-(imgWidth - screenWidth - rightMarginFirstStop), { duration: 40000 }),
        withTiming(-(imgWidth - screenWidth - rightMarginSecondStop), { duration: 10000 })
      )
    }
  }, [])

  useEffect(() => {
    if (Platform.OS === "ios") {
      return
    }
    const unsubscribe = navigation.addListener("blur", () => {
      requestAnimationFrame(() => {
        ArtsyNativeModule.setNavigationBarColor(DEFAULT_NAVIGATION_BAR_COLOR)
        ArtsyNativeModule.setAppLightContrast(false)
      })
    })
    return unsubscribe
  }, [navigation])

  useEffect(() => {
    if (Platform.OS === "ios") {
      return
    }
    const unsubscribe = navigation.addListener("focus", () => {
      requestAnimationFrame(() => {
        ArtsyNativeModule.setNavigationBarColor("#000000")
        ArtsyNativeModule.setAppLightContrast(true)
      })
    })
    return unsubscribe
  }, [navigation])

  // prevents the logo from fading-in after the screen initially loads
  const [userHasSeenFadeIn, setUserHasSeenFadeIn] = useState(false)

  useEffect(() => {
    setUserHasSeenFadeIn(true)
  }, [])

  // brings the authentication panel to the top of the screen
  const [userIsEnteringEmail, setUserIsEnteringEmail] = useState(false)
  const [userIsEnteringPassword, setUserIsEnteringPassword] = useState(false)

  const bottomSheetRef = useRef<BottomSheet>(null)

  const handleBottomSheetChange = (index: number) => {
    console.log("🦆", "handleBottomSheetChange", index)
  }

  const handleEmailInputFocus = () => {
    setUserIsEnteringEmail(true)
  }

  const handleBackButtonPress = () => {
    setUserIsEnteringEmail(false)
  }

  const handleContinueButtonPress = () => {
    setUserIsEnteringEmail(false)
    setUserIsEnteringPassword(true)
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
    <LegacyScreen>
      <LegacyScreen.Background>
        <Animated.View
          style={[
            {
              alignItems: "flex-end",
              position: "absolute",
            },
            slideAnim,
          ]}
        >
          <Image
            source={require("images/WelcomeImage.webp")}
            resizeMode="cover"
            style={{ height: screenHeight }}
          />
        </Animated.View>

        <LinearGradient
          colors={["rgba(0, 0, 0, 0)", `rgba(0, 0, 0, 0.75)`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            position: "absolute",
            width: "100%",
            height: screenHeight,
          }}
        />
      </LegacyScreen.Background>

      <LegacyScreen.Body>
        {!(userIsEnteringEmail || userIsEnteringPassword) && (
          <MotiView
            style={{ flex: 1, alignItems: "center", width: "100%" }}
            from={{ opacity: userHasSeenFadeIn ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", duration: 1500 }}
          >
            <Spacer y={1} />
            <ArtsyLogoWhiteIcon height={25} width={75} />
          </MotiView>
        )}

        {!(userIsEnteringEmail || userIsEnteringPassword) && (
          <MotiView
            from={{ opacity: userHasSeenFadeIn ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", duration: 1500 }}
          >
            <Text variant="xl" color="white">
              Collect Art by the World’s Leading Artists
            </Text>

            <Spacer y={1} />

            <Text variant="sm" color="white">
              Build your personalized profile, get market insights, buy and sell art with
              confidence.
            </Text>

            <Spacer y={2} />

            <LegacyScreen.SafeBottomPadding />
          </MotiView>
        )}

        <View style={{ flex: 1 }}>
          <BottomSheet
            ref={bottomSheetRef}
            onChange={handleBottomSheetChange}
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
                    !userIsEnteringPassword ? emailValidationSchema : passwordValidationSchema
                  }
                  validateOnMount
                >
                  {({ handleBlur, handleChange, handleSubmit, isValid, values }) => (
                    <>
                      {(!!userIsEnteringEmail || !!userIsEnteringPassword) && (
                        <BackButton onPress={handleBackButtonPress} />
                      )}
                      {!userIsEnteringPassword ? (
                        <Text variant="sm-display">Sign up or log in</Text>
                      ) : (
                        <Text variant="sm-display">Welcome back to Artsy</Text>
                      )}
                      {!userIsEnteringPassword ? (
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
                      ) : (
                        <Field
                          name="password"
                          autoCapitalize="none"
                          autoComplete="current-password"
                          autoCorrect={false}
                          secureTextEntry={true}
                          component={BottomSheetInput}
                          placeholder="Enter your password"
                          returnKeyType="done"
                          title="Password"
                          value={values.password}
                          onChangeText={handleChange("password")}
                        />
                      )}
                      {!(userIsEnteringEmail || userIsEnteringPassword) && (
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
                              <Image
                                source={require("images/facebook.webp")}
                                resizeMode="contain"
                              />
                            </Flex>
                          </Flex>
                        </Flex>
                      )}
                      {!(userIsEnteringEmail || userIsEnteringPassword) && (
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
                      {(!!userIsEnteringEmail || !!userIsEnteringPassword) && (
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
      </LegacyScreen.Body>
    </LegacyScreen>
  )
}

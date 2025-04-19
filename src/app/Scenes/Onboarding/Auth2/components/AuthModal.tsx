import { Box, Flex, useTheme } from "@artsy/palette-mobile"
import { AuthContext } from "app/Scenes/Onboarding/Auth2/AuthContext"
import { useOnboardingAuth2Tracking } from "app/Scenes/Onboarding/Auth2/hooks/useOnboardingAuth2Tracking"
import { MotiView } from "moti"
import { useEffect, useMemo } from "react"
import { Dimensions } from "react-native"
import { Easing } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const HEIGHT = {
  LoginWelcomeStep: 320,
  LoginEmailStep: 320,
  LoginPasswordStep: 320,
  ForgotPasswordStep: 320,
  LoginOTPStep: 280,
  OnboardingWebView: 300,
  SignUpPasswordStep: 300,
  SignUpNameStep: 500,
  collapsed: 300,
}

export const AuthModal: React.FC = ({ children }) => {
  const { isModalExpanded, isMounted, currentScreen } = AuthContext.useStoreState((state) => state)

  const { color, space } = useTheme()
  const insets = useSafeAreaInsets()

  const tracking = useOnboardingAuth2Tracking()

  useEffect(() => {
    tracking.authImpression()
  }, [])

  const screenHeight = Dimensions.get("window").height

  const height = useMemo(() => {
    if (isModalExpanded) {
      return HEIGHT[currentScreen?.name ?? "LoginWelcomeStep"]
    }

    return HEIGHT.collapsed
  }, [currentScreen])

  const translateY = useMemo(() => {
    // Position the modal in the center of the screen, minus some padding
    if (isModalExpanded) {
      return insets.top + space(6)
    }

    return screenHeight - height - insets.bottom
  }, [isModalExpanded, height])

  return (
    <Box flex={1} height="100%">
      <MotiView
        from={{
          translateY: isModalExpanded ? 0 : screenHeight,
        }}
        animate={{
          translateY,
        }}
        transition={{
          type: "timing",
          duration: isModalExpanded ? 800 : 600,
          delay: isMounted ? 0 : 500,
          easing: Easing.out(Easing.exp),
        }}
        style={{
          width: "100%",
          backgroundColor: color("mono0"),
          borderRadius: space(1),
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Flex justifyContent="center" p={1}>
          {children}
        </Flex>
      </MotiView>
    </Box>
    // </KeyboardAvoidingView>
  )
}

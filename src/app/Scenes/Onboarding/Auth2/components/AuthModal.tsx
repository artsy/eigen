import { Box, Flex, useTheme } from "@artsy/palette-mobile"
import { AuthContext } from "app/Scenes/Onboarding/Auth2/AuthContext"
import { MotiView } from "moti"
import { Dimensions, KeyboardAvoidingView, Platform } from "react-native"
import { Easing } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const HEIGHT = {
  EmailSocialStep: 280,
  LoginPasswordStep: 300,
  collapsed: 300,
}

export const AuthModal: React.FC = ({ children }) => {
  const { isModalExpanded, isMounted, currentScreen } = AuthContext.useStoreState((state) => state)

  const screenHeight = Dimensions.get("window").height
  const { space } = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Box justifyContent="flex-end" flex={1}>
        <MotiView
          from={{
            height: HEIGHT.collapsed,
            bottom: space(4),
            translateY: isModalExpanded ? 0 : screenHeight * 4,
          }}
          animate={{
            height: isModalExpanded ? HEIGHT[currentScreen.name] : HEIGHT.collapsed,
            translateY: 0,
          }}
          transition={{
            type: "timing",
            duration: 600,
            delay: isMounted ? 0 : 500,
            easing: Easing.out(Easing.exp),
          }}
          style={{
            width: "100%",
            backgroundColor: "white",
            borderRadius: space(2),
            overflow: "hidden",
          }}
        >
          <Flex height="100%" justifyContent="center" p={1}>
            {children}
          </Flex>
        </MotiView>
      </Box>
    </KeyboardAvoidingView>
  )
}

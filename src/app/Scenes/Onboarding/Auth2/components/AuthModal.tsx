import { Box, Flex, useTheme } from "@artsy/palette-mobile"
import { AuthContext } from "app/Scenes/Onboarding/Auth2/AuthContext"
import { MotiView } from "moti"
import { Dimensions, KeyboardAvoidingView, Platform } from "react-native"
import { Easing } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const HEIGHT = {
  expanded: 500,
  collapsed: 300,
}

export const AuthModal: React.FC = ({ children }) => {
  const isModalExpanded = AuthContext.useStoreState((state) => state.isModalExpanded)

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
            bottom: space(2),
          }}
          animate={{
            height: isModalExpanded ? screenHeight * 0.5 - insets.top : HEIGHT.collapsed,
          }}
          transition={{
            type: "timing",
            duration: 700,
            easing: Easing.out(Easing.exp),
          }}
          style={{
            width: "100%",
            backgroundColor: "white",
            borderRadius: space(2),
            // alignItems: "center",
            // justifyContent: "center",
            // overflow: "hidden",
          }}
        >
          <MotiView
            from={{
              translateY: 0,
            }}
            animate={
              {
                // translateY: expanded ? -screenHeight * 0.4 + 150 : 0,
              }
            }
            transition={{
              type: "timing",
              duration: 500,
              easing: Easing.out(Easing.exp),
            }}
            style={{
              flex: 1,
              padding: 10,
            }}
          >
            <Flex height="100%" justifyContent="center">
              {children}
            </Flex>
          </MotiView>
        </MotiView>
      </Box>
    </KeyboardAvoidingView>
  )
}

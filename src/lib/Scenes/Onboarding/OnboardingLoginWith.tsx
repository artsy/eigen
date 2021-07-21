import { StackScreenProps } from "@react-navigation/stack"
import { LinkText } from "lib/Components/Text/LinkText"
import { BackButton } from "lib/navigation/BackButton"
import { GlobalStore } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { AppleIcon, Button, EmailIcon, FacebookIcon, Flex, GoogleIcon, Spacer, Text } from "palette"
import React from "react"
import { ScrollView, View } from "react-native"
import { OnboardingNavigationStack } from "./Onboarding"

interface OnboardingLogInWithProps extends StackScreenProps<OnboardingNavigationStack, "OnboardingLoginWith"> {}

export const OnboardingLoginWith: React.FC<OnboardingLogInWithProps> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: "white", flexGrow: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: useScreenDimensions().safeAreaInsets.top, paddingHorizontal: 20 }}
      >
        <Spacer mt={100} />
        <Text fontSize="50px">Log In</Text>
        <Spacer mt={30} />
        <Flex>
          <Button onPress={() => navigation.navigate("OnboardingLogin")} block variant="secondaryOutline">
            <Flex flexDirection="row" alignItems="center">
              <EmailIcon></EmailIcon>
              <Text fontSize="16px">Continue with email</Text>
            </Flex>
          </Button>
          <Spacer mt={20} />
          <Button
            onPress={() => GlobalStore.actions.auth.authFacebook({ signInOrUp: "signIn" })}
            block
            variant="secondaryOutline"
          >
            <Flex flexDirection="row" alignItems="center">
              <FacebookIcon width="25px" height="25px" fill="blue100"></FacebookIcon>
              <Text fontSize="16px">Continue with Facebook</Text>
            </Flex>
          </Button>
          <Spacer mt={20} />
          <Button block variant="secondaryOutline">
            <Flex flexDirection="row" alignItems="center">
              <GoogleIcon></GoogleIcon>
              <Text fontSize="16px">Continue with Google</Text>
            </Flex>
          </Button>
          <Spacer mt={20} />
          <Button block variant="secondaryOutline">
            <Flex flexDirection="row" alignItems="center">
              <AppleIcon></AppleIcon>
              <Text fontSize="16px">Continue with Apple</Text>
            </Flex>
          </Button>
        </Flex>
        <Flex alignItems="center">
          <Spacer mt={40} />
          <Text variant="small" color="black60">
            By tapping Next, Continue with Facebook or Apple, you agree to Artsy's Terms of Use and Privacy Policy
          </Text>
          <Spacer mt={40} />
          <Text>
            Don’t have an account?{" "}
            <LinkText onPress={() => navigation.navigate("OnboardingCreateAccountWith")}>Sign up</LinkText>
          </Text>
        </Flex>
      </ScrollView>
      <BackButton onPress={() => navigation.goBack()} />
    </View>
  )
}

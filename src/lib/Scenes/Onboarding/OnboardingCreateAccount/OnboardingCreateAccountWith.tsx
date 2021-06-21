import { StackScreenProps } from "@react-navigation/stack"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Button, Flex, Spacer, Text } from "palette"
import React from "react"
import { ScrollView, View } from "react-native"
import { OnboardingNavigationStack } from "../Onboarding"

interface OnboardingCreateAccountWithProps
  extends StackScreenProps<OnboardingNavigationStack, "OnboardingCreateAccountWith"> {}

export const OnboardingCreateAccountWith: React.FC<OnboardingCreateAccountWithProps> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: "white", flexGrow: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: useScreenDimensions().safeAreaInsets.top, paddingHorizontal: 20 }}
      >
        <Spacer mt={122} />
        <Text fontSize="50px">Sign Up</Text>
        <Spacer mt={60} />
        <Flex>
          <Button onPress={() => navigation.navigate("OnboardingCreateAccount")} block variant="secondaryOutline">
            Continue with email
          </Button>
          <Spacer mt={20} />
          <Button block variant="secondaryOutline">
            Continue with Facebook
          </Button>
          <Spacer mt={20} />
          <Button block variant="secondaryOutline">
            Continue with Google
          </Button>
          <Spacer mt={20} />
          <Button block variant="secondaryOutline">
            Continue with Apple
          </Button>
          <Spacer mt={80} />
          <Text variant="small" color="black60">
            By tapping Next, Continue with Facebook or Apple, you agree to Artsy's Terms of Use and Privacy Policy
          </Text>
        </Flex>
      </ScrollView>
    </View>
  )
}

import { StackScreenProps } from "@react-navigation/stack"
import { ArtsyWebViewPage } from "app/Components/ArtsyWebView"
import { Flex } from "palette"
import { OnboardingNavigationStack } from "./Onboarding"

export interface OnboardingWebViewProps
  extends StackScreenProps<OnboardingNavigationStack, "OnboardingWebView"> {}

export const OnboardingWebView: React.FC<OnboardingWebViewProps> = ({ route, navigation }) => {
  return (
    <Flex flex={1} style={{ backgroundColor: "white" }}>
      <ArtsyWebViewPage url={route.params.url} backAction={() => navigation.goBack()} />
    </Flex>
  )
}

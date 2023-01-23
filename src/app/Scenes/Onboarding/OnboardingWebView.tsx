import { StackScreenProps } from "@react-navigation/stack"
import { ArtsyWebViewPage } from "app/Components/ArtsyWebView"
import { OnboardingNavigationStack } from "./Onboarding"

export type OnboardingWebViewProps = StackScreenProps<
  OnboardingNavigationStack,
  "OnboardingWebView"
>

export type OnboardingWebViewRoute = "/privacy" | "/terms" | "/conditions-of-sale"

export const OnboardingWebView: React.FC<OnboardingWebViewProps> = ({ route, navigation }) => {
  return <ArtsyWebViewPage url={route.params.url} backAction={() => navigation.goBack()} />
}

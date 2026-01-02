import { internal_navigationRef } from "app/Navigation/Navigation"
import { __unsafe__onboardingNavigationRef } from "app/Scenes/Onboarding/Screens/Onboarding"

export const navigateToDevMenu = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  if (!isLoggedIn) {
    __unsafe__onboardingNavigationRef.current?.navigate("DevMenu")
  } else {
    // We are intentionally using navigate from the navigation ref to avoid showing the dev menu twice on multiple taps
    internal_navigationRef.current?.navigate("DevMenu")
  }
}

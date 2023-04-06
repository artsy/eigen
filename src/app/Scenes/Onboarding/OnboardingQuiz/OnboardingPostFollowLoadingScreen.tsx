import { FullScreenLoadingImage } from "app/Components/FullScreenLoadingImage"
import { Screen } from "app/Components/Screen"
import useTimeoutFn from "react-use/lib/useTimeoutFn"
import { useBackHandler } from "shared/hooks/useBackHandler"
import { useOnboardingContext } from "./Hooks/useOnboardingContext"

const NAVIGATE_TO_NEXT_SCREEN_DELAY = 2000

export const OnboardingPostFollowLoadingScreen = () => {
  const { onDone } = useOnboardingContext()
  const text = "Great start\nFollow more as you browse and\ncontinue tailoring Artsy to your tastes"

  // prevents Android users from going back with hardware button
  useBackHandler(() => true)
  useTimeoutFn(onDone, NAVIGATE_TO_NEXT_SCREEN_DELAY)

  return (
    <Screen>
      <Screen.Background>
        <FullScreenLoadingImage
          imgSource={require("images/HirstTheWonder.jpg")}
          loadingText={text}
        />
      </Screen.Background>
    </Screen>
  )
}

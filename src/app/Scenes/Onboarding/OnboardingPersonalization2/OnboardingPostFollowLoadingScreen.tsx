import { FullScreenLoadingImage } from "app/Components/FullScreenLoadingImage"
import { Screen } from "palette"
import useTimeoutFn from "react-use/lib/useTimeoutFn"
import { useOnboardingContext } from "./Hooks/useOnboardingContext"

const NAVIGATE_TO_NEXT_SCREEN_DELAY = 500

export const OnboardingPostFollowLoadingScreen = () => {
  const { onDone } = useOnboardingContext()
  const text = "Great start\nWe are personalizing your Artsy home"

  useTimeoutFn(onDone, NAVIGATE_TO_NEXT_SCREEN_DELAY)

  return (
    <Screen>
      <Screen.Background>
        <FullScreenLoadingImage
          imgSource={require("images/HirstTheWonder.webp")}
          loadingText={text}
          spacerHeight="70px"
        />
      </Screen.Background>
    </Screen>
  )
}

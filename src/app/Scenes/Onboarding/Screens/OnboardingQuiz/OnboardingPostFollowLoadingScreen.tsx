import { LegacyScreen } from "@artsy/palette-mobile"
import { FullScreenLoadingImage } from "app/Components/FullScreenLoadingImage"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import useTimeoutFn from "react-use/lib/useTimeoutFn"
import { useOnboardingContext } from "./Hooks/useOnboardingContext"

const NAVIGATE_TO_NEXT_SCREEN_DELAY = 2000

export const OnboardingPostFollowLoadingScreen = () => {
  const { onDone } = useOnboardingContext()
  const text = "Follow more as you browse and\ncontinue tailoring Artsy to your tastes"

  // prevents Android users from going back with hardware button
  useBackHandler(() => true)
  useTimeoutFn(onDone, NAVIGATE_TO_NEXT_SCREEN_DELAY)

  return (
    <LegacyScreen>
      <LegacyScreen.Background>
        <FullScreenLoadingImage
          imgSource={require("images/HirstTheWonder.webp")}
          title="Great start"
          loadingText={text}
        />
      </LegacyScreen.Background>
    </LegacyScreen>
  )
}

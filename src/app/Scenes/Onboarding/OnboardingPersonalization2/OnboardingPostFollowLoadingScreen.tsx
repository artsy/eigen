import { FullScreenLoadingImage } from "app/Components/FullScreenLoadingImage"
import { Screen } from "palette"

export const OnboardingPostFollowLoadingScreen = () => {
  const text = "Great start\nWe are personalizing your Artsy home"
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

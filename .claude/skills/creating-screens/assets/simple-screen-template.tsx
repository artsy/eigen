import { Screen, Spacer, Text } from "@artsy/palette-mobile"
import { goBack } from "app/system/navigation/navigate"

interface ScreenNameProps {
  // Route params go here
}

export const ScreenName: React.FC<ScreenNameProps> = (props) => {
  return (
    <Screen>
      <Screen.AnimatedHeader title="Screen Title" onBack={goBack} />
      <Screen.Body>
        <Screen.ScrollView>
          <Text variant="lg">Content here</Text>
          <Spacer y={2} />
        </Screen.ScrollView>
      </Screen.Body>
    </Screen>
  )
}

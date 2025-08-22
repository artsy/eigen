import { Button, Flex, Screen } from "@artsy/palette-mobile"
import notifee from "@notifee/react-native"
import { L0IntroductionToReanimated } from "app/Scenes/Playground/Animation/L0-Reanimated"
import { L1AnimatedComponent } from "app/Scenes/Playground/Animation/L1-Animated-Components"
import { L2SharedValues } from "app/Scenes/Playground/Animation/L2-Shared-Values"
import { L3Moti } from "app/Scenes/Playground/Animation/L3-Moti"
import { L4Gestures } from "app/Scenes/Playground/Animation/L4-Gestures"
import { Exercice } from "app/Scenes/Playground/Animation/L5-Exercice"

// eslint-disable-next-line prefer-const
let LEVEL = 5

// @ts-ignore
const Content: React.FC = () => {
  switch (LEVEL) {
    case 0:
      return <L0IntroductionToReanimated />
    case 1:
      return <L1AnimatedComponent />
    case 2:
      return <L2SharedValues />
    case 3:
      return <L3Moti />
    case 4:
      return <L4Gestures />
    case 5:
      return <Exercice />
    default:
      return null
  }
}

const TestContent: React.FC = () => {
  const handlePress = async () => {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    const channelId = await notifee.createChannel({
      id: "Test",
      name: "Test Channel",
    })

    await notifee.displayNotification({
      title: "Notification Title",
      body: "Main body content of the notification",
      android: {
        channelId,
        smallIcon: "ic_notification", // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: "default",
        },
      },
    })
  }

  return (
    <Flex justifyContent="center" alignItems="center" flex={1}>
      <Button onPress={handlePress}>Trigger Push Notification</Button>
    </Flex>
  )
}

export const Animations = () => {
  return (
    <Screen>
      <Screen.Header title="Animations with Reanimated 3" hideLeftElements />
      <Screen.Body fullwidth>
        <TestContent />
      </Screen.Body>
    </Screen>
  )
}

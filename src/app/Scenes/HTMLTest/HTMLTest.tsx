import { Screen, Spacer, Text } from "@artsy/palette-mobile"
import { goBack } from "app/system/navigation/navigate"

export const HTMLTest: React.FC = () => {
  return (
    <Screen>
      <Screen.AnimatedHeader title="HTML Test" onBack={goBack} />
      <Screen.Body>
        <Screen.ScrollView>
          <Text variant="lg">HTML Test Screen</Text>
          <Spacer y={2} />
          <Text variant="lg">HTML Test Screen</Text>
          <Spacer y={2} />
          <Text variant="lg">HTML Test Screen</Text>
          <Spacer y={2} />
          <Text variant="lg">HTML Test Screen</Text>
          <Spacer y={2} />
          <Text variant="lg">HTML Test Screen</Text>
          <Spacer y={2} />
          <Text variant="lg">HTML Test Screen</Text>
          <Spacer y={2} />
          <Text variant="lg">HTML Test Screen</Text>
          <Spacer y={2} />
          <Text variant="lg">HTML Test Screen</Text>
          <Spacer y={2} />
          <Text variant="lg">HTML Test Screen</Text>
          <Spacer y={2} />
          <Text variant="lg">HTML Test Screen</Text>
          <Spacer y={2} />
          <Text variant="lg">HTML Test Screen</Text>
          <Spacer y={2} />
          <Text variant="lg">HTML Test Screen</Text>
          <Spacer y={2} />
          <Text variant="lg">HTML Test Screen</Text>
          <Spacer y={2} />
          <Text variant="lg">HTML Test Screen</Text>
          <Spacer y={2} />
        </Screen.ScrollView>
      </Screen.Body>
    </Screen>
  )
}

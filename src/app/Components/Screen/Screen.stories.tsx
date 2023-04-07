import { Flex, Text } from "@artsy/palette-mobile"
import { ComponentMeta, ComponentStory } from "@storybook/react-native"
import { Button } from "app/Components/Button"
import { Input } from "app/Components/Input"
import { Screen } from "./Screen"

const ScreenMeta: ComponentMeta<typeof Screen> = {
  title: "palette/organisms/Screen",
  component: Screen,
  parameters: { noSafeArea: true },
}
export default ScreenMeta
type ScreenStory = ComponentStory<typeof Screen>

export const Regular: ScreenStory = () => (
  <Screen>
    <Screen.Body>
      <Text>Hello</Text>
    </Screen.Body>
  </Screen>
)

export const FullBackground: ScreenStory = () => (
  <Screen>
    <Screen.Background>
      <Flex flex={1} backgroundColor="blue" />
    </Screen.Background>
    <Screen.Body>
      <Text>Hello</Text>
    </Screen.Body>
  </Screen>
)

export const FullBackgroundDifferentColors: ScreenStory = () => (
  <Screen>
    <Screen.Background>
      <Flex flex={1} backgroundColor="blue" />
    </Screen.Background>
    <Screen.Body backgroundColor="pink">
      <Text>Hello</Text>
    </Screen.Body>
  </Screen>
)

export const FullBackgroundDifferentColorsManual: ScreenStory = () => (
  <Screen>
    <Screen.Background>
      <Flex flex={1} backgroundColor="blue" />
    </Screen.Background>
    <Screen.Body fullwidth>
      <Screen.BodyXPadding flex={1} backgroundColor="orange">
        <Text>Hello</Text>
      </Screen.BodyXPadding>
    </Screen.Body>
  </Screen>
)

export const RegularHeader: ScreenStory = () => (
  <Screen>
    <Screen.Header onBack={() => {}} />
    <Screen.Body>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
    </Screen.Body>
  </Screen>
)

export const NoHeader: ScreenStory = () => (
  <Screen>
    <Screen.Body>
      <Text>Hello</Text>
    </Screen.Body>
  </Screen>
)

export const FloatingHeader: ScreenStory = () => (
  <Screen>
    <Screen.FloatingHeader onBack={() => {}} />
    <Screen.Body>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
    </Screen.Body>
  </Screen>
)

export const ScrollScreen: ScreenStory = () => (
  <Screen>
    <Screen.Body scroll>
      <Text>Hello</Text>
    </Screen.Body>
  </Screen>
)

export const ScrollScreenWithRegularHeader: ScreenStory = () => (
  <Screen>
    <Screen.Header onBack={() => {}} />
    <Screen.Body scroll>
      <Text>Hello</Text>
    </Screen.Body>
  </Screen>
)

export const ScrollScreenWithFloatingHeader: ScreenStory = () => (
  <Screen>
    <Screen.FloatingHeader onBack={() => {}} />
    <Screen.Body scroll noTopSafe noBottomSafe>
      <Text>Hello</Text>
    </Screen.Body>
  </Screen>
)

export const ScrollScreenWithBottomView: ScreenStory = () => (
  <Screen>
    <Screen.Body scroll>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Text>Hello</Text>
      <Input />
      <Screen.BottomView>
        <Button onPress={() => {}} block>
          Bottom Action
        </Button>
      </Screen.BottomView>
    </Screen.Body>
  </Screen>
)

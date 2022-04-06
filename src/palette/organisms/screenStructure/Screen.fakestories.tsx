import { Button, Flex, Input, Screen, Text } from "palette"

/**
 * To use this file, do the following:
 * - run `yarn start`.
 * - log out in the app if you are logged in.
 * - go to file `src/app/Scenes/Onboarding/Onboarding.tsx`.
 *   - uncomment the line `import { OnboardingWelcome } from "palette/organisms/screenStructure/Screen.fakestories"`.
 *   - comment out the line `import { OnboardingWelcome } from "./OnboardingWelcome"`.
 * You can now use this file to test out `Screen` and friends.
 *
 * If you add a new story, just make it, then add it at the bottom of this file to the `FakeStories`
 * object, then use it in the `OnboardingWelcome` assignment on the last line.
 *
 * It should appear on your simulator now!
 *
 * PS, while developing and changing code in the `Screen` and friends components, you might need to
 * restart the app on the simulator to see the changes.
 */

const Regular = () => (
  <Screen>
    <Screen.Body>
      <Text>Hello</Text>
    </Screen.Body>
  </Screen>
)

const FullBackground = () => (
  <Screen>
    <Screen.Background>
      <Flex flex={1} backgroundColor="blue" />
    </Screen.Background>
    <Screen.Body>
      <Text>Hello</Text>
    </Screen.Body>
  </Screen>
)

const FullBackgroundDifferentColors = () => (
  <Screen>
    <Screen.Background>
      <Flex flex={1} backgroundColor="blue" />
    </Screen.Background>
    <Screen.Body backgroundColor="pink">
      <Text>Hello</Text>
    </Screen.Body>
  </Screen>
)

const FullBackgroundDifferentColorsManual = () => (
  <Screen>
    <Screen.Background>
      <Flex flex={1} backgroundColor="blue" />
    </Screen.Background>
    <Screen.Body fullwidth>
      <Screen.BodyPadding flex={1} backgroundColor="orange">
        <Text>Hello</Text>
      </Screen.BodyPadding>
    </Screen.Body>
  </Screen>
)

const RegularHeader = () => (
  <Screen>
    {/* tslint:disable-next-line:no-empty */}
    <Screen.Header onBack={() => {}} />
    <Screen.Body>
      <Text>Hello</Text>
    </Screen.Body>
  </Screen>
)

const NoHeader = () => (
  <Screen>
    <Screen.Body>
      <Text>Hello</Text>
    </Screen.Body>
  </Screen>
)

const FloatingHeader = () => (
  <Screen>
    {/* tslint:disable-next-line:no-empty */}
    <Screen.FloatingHeader onBack={() => {}} />
    <Screen.Body>
      <Text>Hello</Text>
    </Screen.Body>
  </Screen>
)

const ScrollScreen = () => (
  <Screen>
    <Screen.Body scroll>
      <Text>Hello</Text>
    </Screen.Body>
  </Screen>
)

const ScrollScreenWithRegularHeader = () => (
  <Screen>
    {/* tslint:disable-next-line:no-empty */}
    <Screen.Header onBack={() => {}} />
    <Screen.Body scroll>
      <Text>Hello</Text>
    </Screen.Body>
  </Screen>
)

const ScrollScreenWithFloatingHeader = () => (
  <Screen>
    {/* tslint:disable-next-line:no-empty */}
    <Screen.FloatingHeader onBack={() => {}} />
    <Screen.Body scroll nosafe>
      <Text>Hello</Text>
    </Screen.Body>
  </Screen>
)

const ScrollScreenWithBottomView = () => (
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
        {/* tslint:disable-next-line:no-empty */}
        <Button onPress={() => {}} block>
          Bottom Action
        </Button>
      </Screen.BottomView>
    </Screen.Body>
  </Screen>
)

const FakeStories = {
  Regular,
  FullBackground,
  FullBackgroundDifferentColors,
  FullBackgroundDifferentColorsManual,
  RegularHeader,
  NoHeader,
  FloatingHeader,
  ScrollScreen,
  ScrollScreenWithRegularHeader,
  ScrollScreenWithFloatingHeader,
  ScrollScreenWithBottomView,
}

export const OnboardingWelcome = FakeStories.ScrollScreenWithBottomView

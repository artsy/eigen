import { storiesOf } from "@storybook/react-native"
import { Text } from "palette"
import { Screen } from "./Screen"

storiesOf("palette/organisms/Screen", module).add("Regular", () => (
  <Screen>
    <Screen.Body>
      <Text>Storybook doesn't support outside-of-safe-area rendering.</Text>
      <Text>
        To test our `Screen`, use `yarn start` and navigate to `Screen.fakestories.tsx` in your
        editor.
      </Text>
    </Screen.Body>
  </Screen>
))

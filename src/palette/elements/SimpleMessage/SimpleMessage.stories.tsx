import { Text } from "@artsy/palette-mobile"
import { storiesOf } from "@storybook/react-native"
import { SimpleMessage } from "palette"
import { withTheme } from "storybook/decorators"
import { List } from "storybook/helpers"

storiesOf("SimpleMessage", module)
  .addDecorator(withTheme)
  .add("Variants", () => (
    <List contentContainerStyle={{ marginHorizontal: 20, alignItems: "stretch" }}>
      <SimpleMessage>
        <Text>This is a simple message.</Text>
      </SimpleMessage>
    </List>
  ))

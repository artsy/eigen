import { storiesOf } from "@storybook/react-native"
import { Text } from "palette"
import { withHooks, withScreenDimensions, withTheme } from "storybook/decorators"
import { List } from "storybook/helpers"
import { Touchable } from "."
import { _test_DisplayState } from "../Button/Button"

storiesOf("Touchable", module)
  .addDecorator(withTheme)
  .addDecorator(withScreenDimensions)
  .addDecorator(withHooks)
  .add("Presses", () => (
    <List>
      <Touchable onPress={() => console.warn("regular")}>
        <Text>Regular press</Text>
      </Touchable>
      <Touchable onPress={() => console.warn("regular")} onLongPress={() => console.warn("long")}>
        <Text>Regular and Long press</Text>
      </Touchable>
      <Touchable
        onPress={() => console.warn("regular")}
        onLongPress={[
          { title: "Action 1", systemIcon: "heart", onPress: () => console.warn("1") },
          { title: "Action 2", onPress: () => console.warn("2") },
        ]}
      >
        <Text>Regular and Context press</Text>
      </Touchable>
    </List>
  ))

import { storiesOf } from "@storybook/react-native"
import { withTracking } from "app/storybook/decorators"
import { List } from "app/storybook/helpers"
import { ReadMore } from "./ReadMore"

storiesOf("ReadMore", module)
  .addDecorator(withTracking)
  .add("Misc", () => (
    <List contentContainerStyle={{ alignItems: "flex-start" }}>
      <ReadMore maxChars={3} content="Small text." />
      <ReadMore maxChars={11} content="Small [text](/artist/andy-warhol)." />
      <ReadMore
        maxChars={30}
        content={`Line break


Which should render an emdash`}
      />
      <ReadMore maxChars={30} content={`Line break\n\nWhich should render an emdash`} />
    </List>
  ))

import { storiesOf } from "@storybook/react-native"
import { SmallCard } from "app/Components/Cards/SmallCard"
import { List } from "storybook/helpers"

storiesOf("SmallCard", module).add("Small Card", () => (
  <List>
    <SmallCard
      images={[
        "https://placekitten.com/200/300",
        "https://placekitten.com/300/300",
        "https://placekitten.com/250/300",
      ]}
      title="wow title"
      subtitle="wow subtitle"
      // tag?: CardTagProps
    />
  </List>
))

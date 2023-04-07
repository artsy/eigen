import { Spacer, Join } from "@artsy/palette-mobile"
import { DecoratorFunction } from "@storybook/addons"
import { storiesOf } from "@storybook/react-native"
import { withHooks, withScreenDimensions } from "app/storybook/decorators"
import { PlaceholderBox, ProvidePlaceholderContext } from "./placeholders"

export const withPlaceholders: DecoratorFunction<React.ReactNode> = (story) => (
  <ProvidePlaceholderContext>{story()}</ProvidePlaceholderContext>
)

storiesOf("Placeholders", module)
  .addDecorator(withScreenDimensions)
  .addDecorator(withPlaceholders)
  .addDecorator(withHooks)
  .add("Test", () => (
    <Join separator={<Spacer y={1} />}>
      <PlaceholderBox width={100} height={100} />
      <PlaceholderBox width={100} height={100} />
      <PlaceholderBox width={100} height={100} />
    </Join>
  ))

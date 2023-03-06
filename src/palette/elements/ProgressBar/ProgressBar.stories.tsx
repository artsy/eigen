import { Flex, Text } from "@artsy/palette-mobile"
import { storiesOf } from "@storybook/react-native"
import { ProgressBar } from "./"

storiesOf("Progress Indicators", module).add("ProgressBar", () => (
  <Flex p={2}>
    <Text>10%</Text>
    <ProgressBar progress={10} />
    <Text>20%</Text>
    <ProgressBar progress={20} />
    <Text>50%</Text>
    <ProgressBar progress={50} />
  </Flex>
))

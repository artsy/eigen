import { storiesOf } from "@storybook/react-native"
import { Box, bullet, Text } from "palette"
import { List } from "storybook/helpers"
import { useSpace } from "../hooks"
import { SpacingUnitV3 } from "../Theme"

const SpaceLine = ({ space: theSpace }: { space: SpacingUnitV3 }) => {
  const space = useSpace()
  return (
    <Box>
      <Box width={space(theSpace)} borderBottomWidth={1} borderColor="black" marginBottom="4px" />
      <Text color="black">
        {typeof theSpace === "string"
          ? `"${theSpace}" ${bullet} ${space(theSpace)}px`
          : `${theSpace}px`}
      </Text>
    </Box>
  )
}

storiesOf("Theme/space", module).add("spaces", () => (
  <List style={{ marginLeft: 50 }} contentContainerStyle={{ alignItems: "flex-start" }}>
    <SpaceLine space="0.5" />
    <SpaceLine space="1" />
    <SpaceLine space="2" />
    <SpaceLine space="4" />
    <SpaceLine space="6" />
    <SpaceLine space="12" />
  </List>
))

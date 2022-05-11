import { storiesOf } from "@storybook/react-native"
import { Text } from "palette"
import { bullet } from "palette/helpers"
import { useSpace } from "palette/hooks"
import { List } from "storybook/helpers"
import { Box } from "../../elements"
import { Spacer, SpacerProps } from "./Spacer"

function SpacerRow(props: { x: SpacerProps["x"] }) {
  const space = useSpace()
  const size = props.x

  return (
    <Box>
      <Box flexDirection="row">
        <Box width={20} height={20} backgroundColor="black" />
        <Spacer {...props} />
        <Box width={20} height={20} backgroundColor="black" />
      </Box>
      <Text color="black">
        {typeof size === "string"
          ? `"${size}" ${bullet} ${space(size as any)}px`
          : `${size as any}px`}
      </Text>
    </Box>
  )
}

function SpacerCol(props: { y: SpacerProps["y"] }) {
  const space = useSpace()
  const size = props.y

  return (
    <Box>
      <Box flexDirection="column">
        <Box width={20} height={20} backgroundColor="black" />
        <Spacer {...props} />
        <Box width={20} height={20} backgroundColor="black" />
      </Box>
      <Text color="black">
        {typeof size === "string"
          ? `"${size}" ${bullet} ${space(size as any)}px`
          : `${size as any}px`}
      </Text>
    </Box>
  )
}

storiesOf("palette/atoms/Spacer", module)
  .add("Horizontal", () => (
    <List style={{ marginLeft: 50 }} contentContainerStyle={{ alignItems: "flex-start" }}>
      <Text>Defined</Text>
      <SpacerRow x="0.5" />
      <SpacerRow x="1" />
      <SpacerRow x="2" />
      <SpacerRow x="4" />
      <SpacerRow x="6" />
      <SpacerRow x="12" />
      <Text>Custom</Text>
      <SpacerRow x={15} />
      <SpacerRow x={50} />
    </List>
  ))
  .add("Vertical", () => (
    <>
      <Text>Defined</Text>

      <List
        horizontal
        style={{ marginTop: 50 }}
        contentContainerStyle={{ alignItems: "flex-start", paddingHorizontal: 10 }}
      >
        <SpacerCol y="0.5" />
        <SpacerCol y="1" />
        <SpacerCol y="2" />
        <SpacerCol y="4" />
        <SpacerCol y="6" />
        <SpacerCol y="12" />
      </List>
      <Text>Custom</Text>
      <List
        horizontal
        style={{ marginTop: 50 }}
        contentContainerStyle={{ alignItems: "flex-start", paddingHorizontal: 10 }}
      >
        <SpacerCol y={15} />
        <SpacerCol y={50} />
      </List>
    </>
  ))

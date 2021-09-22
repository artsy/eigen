import { storiesOf } from "@storybook/react-native"
import { tailwind } from "lib/utils/tailwind"
import { Box, Spacer, Text } from "palette"
import React from "react"
import { View, ViewProps } from "react-native"
import { withThemeV3 } from "storybook/decorators"
import { List } from "storybook/helpers"
import { useSpace } from "./hooks"
import { SpacingUnitV3 } from "./Theme"

const SpaceLine = ({ space: theSpace }: { space: SpacingUnitV3 }) => {
  const space = useSpace()
  return (
    <View>
      <View
        style={{
          width: space(theSpace),
          borderBottomWidth: 1,
          borderColor: "black",
          marginBottom: 4,
        }}
      />
      <Text color="black">"{theSpace}"</Text>
      <Text color="black">{`${space(theSpace)}px`}</Text>
    </View>
  )
}

const MyView: React.FC<ViewProps & { tw: string }> = ({ tw, style, ...rest }) => (
  <View style={[style, tailwind(tw)]} {...rest} />
)

const MySpacer: React.FC<{ h?: SpacingUnitV3; v?: SpacingUnitV3 }> = ({ h, v }) => (
  <MyView tw={h ? `ml-${h}` : v ? `mb-${v}` : ""} />
)

const SpaceLine2 = ({ space: theSpace }: { space: SpacingUnitV3 }) => {
  const space = useSpace()
  return (
    <View>
      <View style={tailwind("w-12 border-b border-black-100 mb-4")} />
      <MyView tw="w-12 border-b border-black-100 mb-4" />
      <Text color="black">"{theSpace}"</Text>
      <Text color="black">{`${space(theSpace)}px`}</Text>
    </View>
  )
}

storiesOf("Theme/Space", module)
  .addDecorator(withThemeV3)
  .add("spaces", () => (
    <List style={{ marginLeft: 50 }} contentContainerStyle={{ alignItems: "flex-start" }}>
      <SpaceLine space="0.5" />
      <SpaceLine space="1" />
      <SpaceLine space="6" />
      <SpaceLine2 space="6" />
      <View style={tailwind("bg-red-100 h-6 w-6 border border-black-60")} />

      <>
        <Box backgroundColor="red100" width={10} height={10} />
        <Spacer mb={2} />
        <Box backgroundColor="red100" width={10} height={10} />
      </>
      <>
        <MyView tw="bg-green-100 w-1 h-1" />
        <MyView tw="mb-2" />
        <MyView tw="bg-green-100 w-1 h-1" />
      </>
      <>
        <MyView tw="bg-green-100 w-1 h-1" />
        <MySpacer v="2" />
        <MyView tw="bg-green-100 w-1 h-1" />
      </>
    </List>
  ))

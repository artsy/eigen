import { storiesOf } from "@storybook/react-native"
import { Box, Flex } from "palette"
import React from "react"
import { Text as RNText, TextStyle, View } from "react-native"
import { withTheme } from "storybook/decorators"
import { DList, List } from "storybook/helpers"
import { Text, TextProps } from "."

const variants: Array<TextProps["variant"]> = ["xs", "sm", "md", "lg", "xl", "xxl"]

storiesOf("Theme/Text", module)
  .addDecorator(withTheme)
  .add("Variants", () => (
    <DList
      data={variants}
      renderItem={({ item: variant }) => <Text variant={variant}>{variant} ~~ This is a text.</Text>}
    />
  ))
  .add("Variants in boxes", () => (
    <DList
      data={variants}
      renderItem={({ item: variant }) => (
        <Box borderWidth={1} borderColor="black" width={100}>
          <Text variant={variant}>{variant} ~~ This is a text.</Text>
        </Box>
      )}
    />
  ))
  .add("Basic props", () => (
    <List>
      <Text>regular ~~ This is a text.</Text>
      <Text caps>caps ~~ This is a text.</Text>
      <Text italic>italics ~~ This is a text.</Text>
      <Text caps italic>
        caps italics ~~ This is a text.
      </Text>
      <Text weight="medium">weight: medium ~~ This is a text.</Text>
    </List>
  ))
  .add("Misc", () => (
    <List>
      <View style={{ borderWidth: 1, borderColor: "black" }}>
        <Text pl="2" mb="3" mr={80} color="red" backgroundColor="orange">
          Testing the other props
        </Text>
      </View>
      <View />
    </List>
  ))
  // this is useful for making sure our custom fonts are rendering at the same height for ios and android
  .add("Font centering", () => {
    const style: TextStyle = { borderWidth: 1, borderColor: "black", fontSize: 16, lineHeight: 16 }
    return (
      <Flex flexDirection="row" flex={1}>
        <Flex flex={1}>
          <RNText>System font</RNText>
          <List>
            <RNText style={style}>regular TEXT.</RNText>
            <RNText style={style}>ALL CAPS text.</RNText>
          </List>
        </Flex>

        <Flex width="1px" height="100%" borderWidth={1} borderColor="black" />

        <Flex flex={1}>
          <RNText>Unica custom font</RNText>
          <List>
            <RNText style={[style, { fontFamily: "Unica77LL-Regular" }]}>regular TEXT.</RNText>
            <RNText style={[style, { fontFamily: "Unica77LL-Regular" }]}>ALL CAPS text.</RNText>
          </List>
        </Flex>
      </Flex>
    )
  })

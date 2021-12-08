import { storiesOf } from "@storybook/react-native"
import React from "react"
import { StyleSheet, View } from "react-native"
import { withTheme } from "storybook/decorators"
import { List } from "storybook/helpers"
import { Text } from "./elements/Text"

import * as IconsObject from "./svgs"

storiesOf("Icons", module)
  .addDecorator(withTheme)
  .add("icons", () => {
    const allIcons = Object.entries(IconsObject)
    return (
      <List contentContainerStyle={styles.contentContainer}>
        {allIcons.map((icon) => {
          const Icon = icon[1]
          const iconName = icon[0]
          return (
            <View style={styles.container} key={iconName}>
              <Icon />
              <Text style={styles.iconName}>{iconName}</Text>
            </View>
          )
        })}
      </List>
    )
  })

const styles = StyleSheet.create({
  contentContainer: { alignItems: "flex-start", paddingLeft: 30 },
  container: {
    alignItems: "center",
    flexDirection: "row",
  },
  iconName: {
    marginLeft: 5,
  },
})

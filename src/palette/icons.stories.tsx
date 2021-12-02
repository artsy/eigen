import { storiesOf } from "@storybook/react-native"
import React from "react"
import { View } from "react-native"
import { withTheme } from "storybook/decorators"
import { List } from "storybook/helpers"
import { Text } from "./elements/Text"

import * as IconsObject from "./svgs"

storiesOf("Icons", module)
  .addDecorator(withTheme)
  .add("icons", () => {
    const iconKeys = Object.keys(IconsObject)
    return (
      <List contentContainerStyle={{ alignItems: "flex-start" }} style={{ paddingLeft: 30 }}>
        {iconKeys.map((icon) => {
          // @ts-ignore
          const IconComponent: React.FC = IconsObject[icon]
          return (
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
              }}
              key={icon}
            >
              <IconComponent />
              <Text
                style={{
                  marginLeft: 5,
                }}
              >
                {icon}
              </Text>
            </View>
          )
        })}
      </List>
    )
  })

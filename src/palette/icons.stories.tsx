import { storiesOf } from "@storybook/react-native"
import React from "react"
import { View } from "react-native"
import { withTheme } from "storybook/decorators"
import { List } from "storybook/helpers"
import { Text } from "./elements/Text"

import * as Icons from "./svgs"

storiesOf("Icons", module)
  .addDecorator(withTheme)
  .add("icons", () => {
    const icons = Object.keys(Icons)
    return (
      <List contentContainerStyle={{ alignItems: "flex-start" }} style={{ paddingLeft: 30 }}>
        {icons.map((icon) => {
          const Component: React.FC = Icons[icon]
          return (
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
              }}
              key={icon}
            >
              <Component />
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

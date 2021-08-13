import { DecoratorFunction } from "@storybook/addons"
import { Flex, Theme, ThemeV2, ThemeV3 } from "palette"
import { usePaletteFlagStore } from "palette/PaletteFlag"
import React, { useState } from "react"
import { Button, View } from "react-native"

export const withThemeV2: DecoratorFunction<React.ReactNode> = (story) => <ThemeV2>{story()}</ThemeV2>

export const withThemeV3: DecoratorFunction<React.ReactNode> = (story) => <ThemeV3>{story()}</ThemeV3>

export const withThemeV2AndSwitcher: DecoratorFunction<React.ReactNode> = (story) => {
  const [theme, setTheme] = useState<"v2" | "v3">("v2")
  const { allowV3, toggleAllowV3 } = usePaletteFlagStore()

  return (
    <Theme theme={theme}>
      <>
        <Flex flexDirection="row" width="100%" justifyContent="center">
          <View>
            <Button title="v3 flag" color={allowV3 ? "green" : "red"} onPress={toggleAllowV3} />
          </View>
          <View style={theme === "v2" && { borderColor: "black", borderWidth: 1 }}>
            <Button title="v2" onPress={() => setTheme("v2")} />
          </View>
          <View style={theme === "v3" && { borderColor: "black", borderWidth: 1 }}>
            <Button title="v3(merged)" onPress={() => setTheme("v3")} />
          </View>
        </Flex>
        {story()}
      </>
    </Theme>
  )
}

/**
 * Add this as the last decorator, if you use any other decorators that use hooks in them.
 */
// @ts-ignore
export const withHooks = (Story) => <Story />

import { DecoratorFunction } from "@storybook/addons"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import { Theme } from "palette"
import React from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"

export const withTheme: DecoratorFunction<React.ReactNode> = (story) => <Theme>{story()}</Theme>

export const withSafeArea: DecoratorFunction<React.ReactNode> = (story) => (
  <SafeAreaProvider>{story()}</SafeAreaProvider>
)

export const withScreenDimensions: DecoratorFunction<React.ReactNode> = (story) => (
  <ProvideScreenDimensions>{story()}</ProvideScreenDimensions>
)

/**
 * Add this as the last decorator, if you use any other decorators that use hooks in them.
 */
// @ts-ignore
export const withHooks = (Story) => <Story />

import { DecoratorFunction } from "@storybook/addons"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import { ThemeV2, ThemeV3 } from "palette"
import React from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"

// TODO-PALETTE-V3 remove this
export const withThemeV2: DecoratorFunction<React.ReactNode> = (story) => <ThemeV2>{story()}</ThemeV2>

// TODO-PALETTE-V3 rename this
export const withThemeV3: DecoratorFunction<React.ReactNode> = (story) => <ThemeV3>{story()}</ThemeV3>

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

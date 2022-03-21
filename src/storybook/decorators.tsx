import { DecoratorFunction } from "@storybook/addons"
import { TrackProvider } from "app/tests/renderWithWrappers"
import { ProvideScreenDimensions } from "app/utils/useScreenDimensions"
import { Theme } from "palette"
import React, { ReactNode } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"

export const withTheme: DecoratorFunction<ReactNode> = (story) => <Theme>{story()}</Theme>

export const withSafeArea: DecoratorFunction<ReactNode> = (story) => (
  <SafeAreaProvider>{story()}</SafeAreaProvider>
)

export const withScreenDimensions: DecoratorFunction<ReactNode> = (story) => (
  <SafeAreaProvider>
    <ProvideScreenDimensions>{story()}</ProvideScreenDimensions>
  </SafeAreaProvider>
)

export const withTracking: DecoratorFunction<ReactNode> = (story) => (
  <TrackProvider>{story()}</TrackProvider>
)

/**
 * Add this as the last decorator, if you use any other decorators that use hooks in them.
 */
// @ts-ignore
export const withHooks = (Story) => <Story />

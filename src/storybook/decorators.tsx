import { DecoratorFunction } from "@storybook/addons"
import { TrackingProvider } from "app/tests/renderWithWrappers"
import { Theme } from "palette"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { ProvideScreenDimensions } from "shared/hooks"

export const withTheme: DecoratorFunction<React.ReactNode> = (story) => <Theme>{story()}</Theme>

export const withSafeArea: DecoratorFunction<React.ReactNode> = (story) => (
  <SafeAreaProvider>{story()}</SafeAreaProvider>
)

export const withScreenDimensions: DecoratorFunction<React.ReactNode> = (story) => (
  <SafeAreaProvider>
    <ProvideScreenDimensions>{story()}</ProvideScreenDimensions>
  </SafeAreaProvider>
)

export const withTracking: DecoratorFunction<React.ReactNode> = (story) => (
  <TrackingProvider>{story()}</TrackingProvider>
)

/**
 * Add this as the last decorator, if you use any other decorators that use hooks in them.
 */
// @ts-ignore
export const withHooks = (Story) => <Story />

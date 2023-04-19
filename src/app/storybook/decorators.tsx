import { Theme } from "@artsy/palette-mobile"
import { DecoratorFunction } from "@storybook/addons"
import { ProvideScreenDimensions } from "app/utils/hooks/useScreenDimensions"
import { TrackingProvider } from "app/utils/tests/renderWithWrappers"
import { SafeAreaProvider } from "react-native-safe-area-context"

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

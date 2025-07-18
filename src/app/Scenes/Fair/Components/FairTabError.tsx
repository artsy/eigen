import { Tabs, useSpace } from "@artsy/palette-mobile"
import { LoadFailureView, LoadFailureViewProps } from "app/Components/LoadFailureView"
import { Platform } from "react-native"
import { useHeaderMeasurements } from "react-native-collapsible-tab-view"

export const FairTabError: React.FC<LoadFailureViewProps> = (fallbackProps) => {
  const space = useSpace()

  const { height } = useHeaderMeasurements()
  // Tabs.ScrollView paddingTop is not working on Android, so we need to set it manually
  const paddingTop = Platform.OS === "android" ? height : space(2)

  return (
    <Tabs.ScrollView contentContainerStyle={{ paddingHorizontal: 0, paddingTop: paddingTop }}>
      <LoadFailureView
        onRetry={fallbackProps.onRetry}
        useSafeArea={false}
        // This is needed to override the default flex={1}
        flex={undefined}
        error={fallbackProps.error}
        showBackButton={false}
        trackErrorBoundary={false}
      />
    </Tabs.ScrollView>
  )
}

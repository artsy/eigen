import { Screen } from "@artsy/palette-mobile"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { goBack } from "app/system/navigation/navigate"

interface ActivityErrorScreenProps {
  headerTitle: string
  error?: Error
}

export const ActivityErrorScreen: React.FC<ActivityErrorScreenProps> = ({ headerTitle, error }) => {
  return (
    <Screen>
      <Screen.Header title={headerTitle} onBack={goBack} />
      <LoadFailureView
        justifyContent="center"
        mb="100px"
        trackErrorBoundary={false}
        error={error}
      />
    </Screen>
  )
}

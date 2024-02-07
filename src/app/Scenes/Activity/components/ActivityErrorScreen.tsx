import { Screen } from "@artsy/palette-mobile"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { goBack } from "app/system/navigation/navigate"

interface ActivityErrorScreenProps {
  headerTitle: string
}

export const ActivityErrorScreen: React.FC<ActivityErrorScreenProps> = ({ headerTitle }) => {
  return (
    <Screen>
      <Screen.Header title={headerTitle} onBack={goBack} />
      <LoadFailureView justifyContent="center" mb="100px" />
    </Screen>
  )
}

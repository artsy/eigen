import { Screen, SimpleMessage } from "@artsy/palette-mobile"
import { goBack } from "app/system/navigation/navigate"

interface ActivityErrorScreenProps {
  headerTitle: string
  error?: Error
}

export const ActivityErrorScreen: React.FC<ActivityErrorScreenProps> = ({ headerTitle }) => {
  return (
    <Screen>
      <Screen.Header title={headerTitle} onBack={goBack} />
      <SimpleMessage m={2}>Something went wrong. Please check back later.</SimpleMessage>
    </Screen>
  )
}

import { AlertsQueryRenderer } from "app/Scenes/Favorites/Alerts/Alerts"
import { ScrollView } from "react-native"

export const AlertsTab = () => {
  return (
    <ScrollView>
      <AlertsQueryRenderer />
    </ScrollView>
  )
}

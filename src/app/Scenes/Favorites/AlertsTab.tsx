import { OwnerType } from "@artsy/cohesion"
import { AlertsQueryRenderer } from "app/Scenes/Favorites/Components/Alerts"
import { useFavoritesScrenTracking } from "app/Scenes/Favorites/useFavoritesTracking"

export const AlertsTab = () => {
  useFavoritesScrenTracking(OwnerType.favoritesAlerts)

  return <AlertsQueryRenderer />
}

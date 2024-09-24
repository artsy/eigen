import { OwnerType } from "@artsy/cohesion"
import { Activity } from "app/Scenes/Activity/Activity"
import { ActivityScreenStore } from "app/Scenes/Activity/ActivityScreenStore"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"

export const ActivityScreen = () => {
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.activities })}
    >
      <ActivityScreenStore.Provider>
        <Activity />
      </ActivityScreenStore.Provider>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

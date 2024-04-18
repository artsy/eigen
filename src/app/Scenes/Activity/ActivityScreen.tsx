import { OwnerType } from "@artsy/cohesion"
import { screen } from "app/utils/track/helpers"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { ActivityScreenStore } from "app/Scenes/Activity/ActivityScreenStore"
import { Activity } from "app/Scenes/Activity/Activity"

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

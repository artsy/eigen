import { OwnerType } from "@artsy/cohesion"
import { ProvideScreenTrackingWithCohesionSchema } from "lib/utils/track"
import { screen } from "lib/utils/track/helpers"
import React from "react"
import { MyCollectionAndSavedWorksQueryRenderer } from "./MyCollectionAndSavedWorks"

/*
 * TODO: Marked For Deletion. Remove when MyCollections is released
 */

export const MyProfileQueryRenderer: React.FC<{}> = ({}) => {
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.profile })}
    >
      <MyCollectionAndSavedWorksQueryRenderer />
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

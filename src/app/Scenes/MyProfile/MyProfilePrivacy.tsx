import { OwnerType } from "@artsy/cohesion"
import { MenuItem } from "app/Components/MenuItem"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { MyProfileScreenWrapper } from "./Components/MyProfileScreenWrapper"

export const MyProfilePrivacy: React.FC<{}> = () => {
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.accountPrivacy,
      })}
    >
      <MyProfileScreenWrapper title="Privacy" contentContainerStyle={{ paddingHorizontal: 0 }}>
        <MenuItem title="Privacy Policy" href="/privacy" />
        <MenuItem title="Personal Data Request" href="/privacy-request" />
      </MyProfileScreenWrapper>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

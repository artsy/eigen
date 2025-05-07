import { OwnerType } from "@artsy/cohesion"
import { MenuItem } from "app/Components/MenuItem"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { MyProfileScreenWrapper } from "./Components/MyProfileScreenWrapper"

export const MyProfileTermsAndConditions: React.FC<{}> = () => {
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.accountTermsAndConditions,
      })}
    >
      <MyProfileScreenWrapper
        title="Terms & Conditions"
        contentContainerStyle={{ paddingHorizontal: 0 }}
      >
        <MenuItem title="Terms & Conditions" href="/terms" />
        <MenuItem title="Auction Conditions of Sale" href="/supplemental-cos" />
      </MyProfileScreenWrapper>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

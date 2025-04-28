import { MenuItem } from "app/Components/MenuItem"
import { MyProfileScreenWrapper } from "./Components/MyProfileScreenWrapper"

export const MyProfileTermsAndConditions: React.FC<{}> = () => {
  return (
    <MyProfileScreenWrapper
      title="Terms & Conditions"
      contentContainerStyle={{ paddingHorizontal: 0 }}
    >
      <MenuItem title="Terms & Conditions" href="/terms" />
      <MenuItem title="Auction Conditions of Sale" href="/supplemental-cos" />
    </MyProfileScreenWrapper>
  )
}

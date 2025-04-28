import { MenuItem } from "app/Components/MenuItem"
import { MyProfileScreenWrapper } from "./Components/MyProfileScreenWrapper"

export const MyProfilePrivacy: React.FC<{}> = () => {
  return (
    <MyProfileScreenWrapper title="Privacy" contentContainerStyle={{ paddingHorizontal: 0 }}>
      <MenuItem title="Privacy Policy" href="/privacy" />
      <MenuItem title="Personal Data Request" href="/privacy-request" />
    </MyProfileScreenWrapper>
  )
}

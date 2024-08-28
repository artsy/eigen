import { MyProfileEditModal_me$key } from "__generated__/MyProfileEditModal_me.graphql"
import { MyProfileEditModal } from "app/Scenes/MyProfile/MyProfileEditModal"
import { FC } from "react"

interface CompleteProfilePromptProps {
  me: MyProfileEditModal_me$key
  visible: boolean
  onDismiss: () => void
}

export const CollectorProfilePrompt: FC<CompleteProfilePromptProps> = ({ me, ...rest }) => {
  return (
    <MyProfileEditModal
      me={me}
      message="Tell us a few more details about yourself to complete your profile."
      {...rest}
    />
  )
}

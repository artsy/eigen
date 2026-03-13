import { MyProfileEditModal_me$key } from "__generated__/MyProfileEditModal_me.graphql"
import { MyProfileEditModal } from "app/Scenes/MyProfile/MyProfileEditModal"

interface CompleteProfilePromptProps {
  me: MyProfileEditModal_me$key
  visible: boolean
  onDismiss: () => void
}

export const CompleteProfilePrompt: React.FC<CompleteProfilePromptProps> = (props) => {
  return (
    <MyProfileEditModal
      message="Stand out and save time by sharing details with the gallery."
      {...props}
    />
  )
}

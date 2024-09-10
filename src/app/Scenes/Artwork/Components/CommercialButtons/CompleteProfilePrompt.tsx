import { CompleteProfilePrompt_artwork$key } from "__generated__/CompleteProfilePrompt_artwork.graphql"
import { MyProfileEditModal_me$key } from "__generated__/MyProfileEditModal_me.graphql"
import { MyProfileEditModal } from "app/Scenes/MyProfile/MyProfileEditModal"
import { graphql, useFragment } from "react-relay"

interface CompleteProfilePromptProps {
  artwork: CompleteProfilePrompt_artwork$key
  me: MyProfileEditModal_me$key
  visible: boolean
  onDismiss: () => void
}

export const CompleteProfilePrompt: React.FC<CompleteProfilePromptProps> = ({
  artwork,
  me,
  ...rest
}) => {
  const artworkData = useFragment(artworkFragment, artwork)

  return (
    <MyProfileEditModal
      me={me}
      message={`Inquiry sent! Tell ${artworkData.partner?.name || ""} more about yourself.`}
      {...rest}
    />
  )
}

const artworkFragment = graphql`
  fragment CompleteProfilePrompt_artwork on Artwork {
    partner {
      name
    }
  }
`

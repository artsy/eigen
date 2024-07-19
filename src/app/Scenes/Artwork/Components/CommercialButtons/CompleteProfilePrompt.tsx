import { CompleteProfilePrompt_artwork$key } from "__generated__/CompleteProfilePrompt_artwork.graphql"
import { MyProfileEditModal } from "app/Scenes/MyProfile/MyProfileEditModal"
import { ArtworkInquiryContext } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import { useContext } from "react"
import { graphql, useFragment } from "react-relay"

interface Props {
  artwork: CompleteProfilePrompt_artwork$key
}

export const CompleteProfilePrompt: React.FC<Props> = ({ artwork }) => {
  const { state, dispatch } = useContext(ArtworkInquiryContext)
  const artworkData = useFragment(artworkFragment, artwork)

  return (
    <MyProfileEditModal
      visible={state.profilePromptVisible}
      message={`Inquiry sent! Tell ${artworkData.partner?.name || ""} more about yourself.`}
      onClose={() => dispatch({ type: "setProfilePromptVisible", payload: false })}
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

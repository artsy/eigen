import { BrowseSimilarWorksModal_artwork$key } from "__generated__/BrowseSimilarWorksModal_artwork.graphql"
import { computeArtworkAlertProps } from "app/Components/Artist/ArtistArtworks/CreateArtworkAlertModal"
import { BrowseSimilarWorksModalContentWrapper } from "app/Scenes/Artwork/Components/BrowseSimilarWorksModal/BrowseSimilarWorksModalContentWrapper"
import { graphql, useFragment } from "react-relay"

interface BrowseSimilarWorksModalProps {
  artwork: BrowseSimilarWorksModal_artwork$key
  visible: boolean
  onClose: () => void
}
export const BrowseSimilarWorksModal: React.FC<BrowseSimilarWorksModalProps> = ({
  artwork,
  onClose,
  visible,
}) => {
  const data = useFragment<BrowseSimilarWorksModalProps["artwork"]>(
    graphql`
      fragment BrowseSimilarWorksModal_artwork on Artwork {
        title
        internalID
        slug
        artistsArray: artists {
          internalID
          name
        }
        attributionClass {
          internalID
        }
        mediumType {
          filterGene {
            slug
            name
          }
        }
      }
    `,
    artwork
  )

  const artworkAlert = computeArtworkAlertProps(data)

  if (!artworkAlert.hasArtists) {
    return null
  }

  return (
    <BrowseSimilarWorksModalContentWrapper
      visible={visible}
      entity={artworkAlert.entity!}
      attributes={artworkAlert.attributes!}
      aggregations={artworkAlert.aggregations!}
      closeModal={onClose}
    />
  )
}

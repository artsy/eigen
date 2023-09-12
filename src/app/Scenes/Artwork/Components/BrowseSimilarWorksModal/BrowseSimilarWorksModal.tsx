import { Box } from "@artsy/palette-mobile"
import { BrowseSimilarWorksModalQuery } from "__generated__/BrowseSimilarWorksModalQuery.graphql"
import { computeArtworkAlertProps } from "app/Components/Artist/ArtistArtworks/CreateArtworkAlertModal"
import { BrowseSimilarWorksModalContentWrapper } from "app/Scenes/Artwork/Components/BrowseSimilarWorksModal/BrowseSimilarWorksModalContentWrapper"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

const BrowseSimilarWorksPlaceholder: React.FC<{}> = () => {
  return <Box backgroundColor="red" height={200}></Box>
}

export const BrowseSimilarWorksModal: React.FC<{ artworkID: string }> = withSuspense((props) => {
  const data = useLazyLoadQuery<BrowseSimilarWorksModalQuery>(SimilarWorksModalQuery, {
    artworkID: props.artworkID,
  })

  const artworkAlert = computeArtworkAlertProps(data.artwork)

  if (!artworkAlert.hasArtists) {
    return null
  }

  return (
    <BrowseSimilarWorksModalContentWrapper
      entity={artworkAlert.entity!}
      attributes={artworkAlert.attributes!}
      aggregations={artworkAlert.aggregations!}
    />
  )
}, BrowseSimilarWorksPlaceholder)

const SimilarWorksModalQuery = graphql`
  query BrowseSimilarWorksModalQuery($artworkID: String!) {
    artwork(id: $artworkID) {
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
  }
`

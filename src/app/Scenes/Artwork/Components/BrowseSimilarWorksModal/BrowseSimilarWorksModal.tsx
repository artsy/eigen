import { Flex, Screen, Box, Spacer } from "@artsy/palette-mobile"
import { BrowseSimilarWorksModalQuery } from "__generated__/BrowseSimilarWorksModalQuery.graphql"
import { BrowseSimilarWorksModal_artwork$key } from "__generated__/BrowseSimilarWorksModal_artwork.graphql"
import { computeArtworkAlertProps } from "app/Components/Artist/ArtistArtworks/CreateArtworkAlertModal"
import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  SavedSearchEntity,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { BrowseSimilarWorksModalContent } from "app/Scenes/Artwork/Components/BrowseSimilarWorksModal/BrowseSimilarWorksModalContent"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { PlaceholderBox, PlaceholderRaggedText } from "app/utils/placeholders"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

const BrowseSimilarWorksPlaceholder: React.FC<{}> = () => {
  return (
    <Box>
      <Screen.Header />
      <Box
        testID="MatchingArtworksPlaceholder"
        borderTopWidth={1}
        borderTopColor="black30"
        pt={1}
        pb={2}
      />
      <Flex mx={2}>
        <PlaceholderRaggedText numLines={2} textHeight={20} />
        <Spacer y={2} />
        <Flex flexDirection="row">
          <PlaceholderBox width={70} height={30} marginRight={10} />
          <PlaceholderBox width={100} height={30} />
        </Flex>
      </Flex>
    </Box>
  )
}

export interface BrowseSimilarWorksModalContentWrapperProps {
  entity: SavedSearchEntity
  attributes: SearchCriteriaAttributes
  aggregations: Aggregations
}

const BrowseSimilarWorksModal: React.FC<{ artwork: BrowseSimilarWorksModal_artwork$key }> = (
  props
) => {
  const artwork = useFragment(similarWorksModalFragment, props.artwork)

  const artworkAlert = computeArtworkAlertProps(artwork)

  if (!artworkAlert.hasArtists) {
    return null
  }

  const params: BrowseSimilarWorksModalContentWrapperProps = {
    aggregations: artworkAlert.aggregations!,
    attributes: artworkAlert.attributes!,
    entity: artworkAlert.entity!,
  }

  return <BrowseSimilarWorksModalContent params={params} />
}

export const BrowseSimilarWorksModalQueryRenderer: React.FC<{ artworkID: string }> = withSuspense(
  (props) => {
    const data = useLazyLoadQuery<BrowseSimilarWorksModalQuery>(SimilarWorksModalQuery, {
      artworkID: props.artworkID,
    })

    return <BrowseSimilarWorksModal artwork={data.artwork!} />
  },
  BrowseSimilarWorksPlaceholder
)

const similarWorksModalFragment = graphql`
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
`

const SimilarWorksModalQuery = graphql`
  query BrowseSimilarWorksModalQuery($artworkID: String!) {
    artwork(id: $artworkID) {
      ...BrowseSimilarWorksModal_artwork
    }
  }
`

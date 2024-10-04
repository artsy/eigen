import { Flex, Screen, Box, Spacer } from "@artsy/palette-mobile"
import { BrowseSimilarWorksQuery } from "__generated__/BrowseSimilarWorksQuery.graphql"
import { BrowseSimilarWorks_artwork$key } from "__generated__/BrowseSimilarWorks_artwork.graphql"
import { computeArtworkAlertProps } from "app/Components/Artist/ArtistArtworks/CreateArtworkAlertModal"
import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  SavedSearchEntity,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { BrowseSimilarWorksContent } from "app/Scenes/Artwork/Components/BrowseSimilarWorks/BrowseSimilarWorksContent"
import { BrowseSimilarWorksErrorState } from "app/Scenes/Artwork/Components/BrowseSimilarWorks/BrowseSimilarWorksErrorState"
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
        mt={1}
      />
      <Flex mx={2} my={2}>
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

export interface BrowseSimilarWorksProps {
  entity: SavedSearchEntity
  attributes: SearchCriteriaAttributes
  aggregations: Aggregations
}

const BrowseSimilarWorks: React.FC<{ artwork: BrowseSimilarWorks_artwork$key }> = (props) => {
  const artwork = useFragment(similarWorksFragment, props.artwork)

  if (!artwork.isEligibleToCreateAlert) {
    return null
  }

  const artworkAlert = computeArtworkAlertProps(artwork)

  if (
    !artworkAlert ||
    !artworkAlert.entity ||
    !artworkAlert.attributes ||
    !artworkAlert.aggregations
  ) {
    return null
  }

  const params: BrowseSimilarWorksProps = {
    aggregations: artworkAlert.aggregations,
    attributes: artworkAlert.attributes,
    entity: artworkAlert.entity,
  }

  return <BrowseSimilarWorksContent params={params} />
}

export const BrowseSimilarWorksQueryRenderer: React.FC<{ artworkID: string }> = withSuspense(
  (props) => {
    const data = useLazyLoadQuery<BrowseSimilarWorksQuery>(SimilarWorksQuery, {
      artworkID: props.artworkID,
    })

    if (!data.artwork) {
      return <BrowseSimilarWorksErrorState />
    }

    return <BrowseSimilarWorks artwork={data.artwork} />
  },
  BrowseSimilarWorksPlaceholder,
  () => {
    return <BrowseSimilarWorksErrorState />
  }
)

const similarWorksFragment = graphql`
  fragment BrowseSimilarWorks_artwork on Artwork {
    title
    internalID
    slug
    isEligibleToCreateAlert
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

const SimilarWorksQuery = graphql`
  query BrowseSimilarWorksQuery($artworkID: String!) {
    artwork(id: $artworkID) {
      ...BrowseSimilarWorks_artwork
    }
  }
`

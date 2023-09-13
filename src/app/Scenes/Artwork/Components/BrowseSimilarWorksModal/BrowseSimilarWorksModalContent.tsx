import { Button, Flex, Pill, Text, useScreenDimensions, useTheme } from "@artsy/palette-mobile"
import {
  BrowseSimilarWorksModalContentQuery,
  FilterArtworksInput,
} from "__generated__/BrowseSimilarWorksModalContentQuery.graphql"
import GenericGrid, { GenericGridPlaceholder } from "app/Components/ArtworkGrids/GenericGrid"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { BrowseSimilarWorksModalContentWrapperProps } from "app/Scenes/Artwork/Components/BrowseSimilarWorksModal/BrowseSimilarWorksModalContentWrapper"
import { extractPills } from "app/Scenes/SavedSearchAlert/pillExtractors"
import { goBack, navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useLocalizedUnit } from "app/utils/useLocalizedUnit"
import { ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery } from "react-relay"

const NUMBER_OF_ARTWORKS_TO_SHOW = 10

export interface BrowseSimilarWorksModalContentProps {
  params: BrowseSimilarWorksModalContentWrapperProps
}

export const BrowseSimilarWorksModalContent: React.FC<BrowseSimilarWorksModalContentProps> = (
  props
) => {
  const { params } = props
  const { attributes, aggregations, entity } = params
  const { localizedUnit } = useLocalizedUnit()
  const { space } = useTheme()
  const { bottom: bottomInset } = useSafeAreaInsets()

  const pills = extractPills({ attributes, aggregations, unit: localizedUnit, entity })

  return (
    <Flex flex={1}>
      <FancyModalHeader
        onLeftButtonPress={goBack}
      >{`Works by ${entity.artists[0].name}`}</FancyModalHeader>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: bottomInset,
          paddingHorizontal: space(2),
        }}
      >
        <Text color="black60" my={2}>
          Available works you may have missed based on similar filters listed below.
        </Text>

        <Flex flexDirection="row" flexWrap="wrap" mb={2}>
          {pills.map((pill, index) => (
            <Pill key={index} variant="filter" disabled mr={1}>
              {pill.label}
            </Pill>
          ))}
        </Flex>
        <SimilarArtworksContainer attributes={attributes} />
      </ScrollView>
    </Flex>
  )
}

const similarArtworksQuery = graphql`
  query BrowseSimilarWorksModalContentQuery($input: FilterArtworksInput, $first: Int) {
    artworksConnection(first: $first, input: $input) {
      counts {
        total
      }
      edges {
        node {
          slug
          ...GenericGrid_artworks
        }
      }
    }
  }
`

const SimilarArtworksPlaceholder: React.FC = () => {
  const screen = useScreenDimensions()
  const { space } = useTheme()
  return <GenericGridPlaceholder width={screen.width - space(4)} />
}

const SimilarArtworksContainer: React.FC<{ attributes: any }> = withSuspense(({ attributes }) => {
  const screen = useScreenDimensions()
  const { space } = useTheme()

  const data = useLazyLoadQuery<BrowseSimilarWorksModalContentQuery>(similarArtworksQuery, {
    first: NUMBER_OF_ARTWORKS_TO_SHOW,
    input: {
      ...attributes,
      forSale: true,
      sort: "-published_at",
    } as FilterArtworksInput,
  })

  if (!data || !data.artworksConnection) {
    return <Text>There aren’t any works available that meet the criteria at this time.</Text>
  }

  const artworks = extractNodes(data.artworksConnection)

  return (
    <>
      <GenericGrid
        width={screen.width - space(2)}
        artworks={artworks}
        onPress={(slug: string) => {
          navigate(`artwork/${slug}`)
        }}
      />
      <Button mt={2} block>
        Explore more on Artsy
      </Button>
    </>
  )
}, SimilarArtworksPlaceholder)

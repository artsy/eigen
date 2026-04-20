import {
  Flex,
  Pill,
  Screen,
  SimpleMessage,
  Spacer,
  Text,
  useScreenDimensions,
  useTheme,
} from "@artsy/palette-mobile"
import {
  BrowseSimilarWorksContentQuery,
  FilterArtworksInput,
} from "__generated__/BrowseSimilarWorksContentQuery.graphql"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import GenericGrid, { GenericGridPlaceholder } from "app/Components/ArtworkGrids/GenericGrid"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { BrowseSimilarWorksProps } from "app/Scenes/Artwork/Components/BrowseSimilarWorks/BrowseSimilarWorks"
import { BrowseSimilarWorksExploreMoreButton } from "app/Scenes/Artwork/Components/BrowseSimilarWorks/BrowseSimilarWorksExploreMoreButton"
import { extractPills } from "app/Scenes/SavedSearchAlert/pillExtractors"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useLocalizedUnit } from "app/utils/useLocalizedUnit"
import { ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery } from "react-relay"

const NUMBER_OF_ARTWORKS_TO_SHOW = 10

export interface BrowseSimilarWorksContentProps {
  params: BrowseSimilarWorksProps
}

export const BrowseSimilarWorksContent: React.FC<BrowseSimilarWorksContentProps> = (props) => {
  const { params } = props
  const { attributes, aggregations, entity } = params
  const { localizedUnit } = useLocalizedUnit()
  const { space } = useTheme()
  const { bottom: bottomInset } = useSafeAreaInsets()

  const pills = extractPills({ attributes, aggregations, unit: localizedUnit, entity })

  return (
    <Screen>
      <NavigationHeader
        onLeftButtonPress={goBack}
      >{`Works by ${entity.artists[0].name}`}</NavigationHeader>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: bottomInset,
          paddingHorizontal: space(2),
        }}
      >
        <Text color="mono60" mt={2} mb={1}>
          Available works you may have missed based on similar filters listed below.
        </Text>

        <Flex flexDirection="row" flexWrap="wrap" mb={2}>
          {pills.map((pill, index) => (
            <Pill key={index} variant="filter" disabled mr={1} mt={1}>
              {pill.label}
            </Pill>
          ))}
        </Flex>
        <SimilarArtworksContainer attributes={attributes} />
      </ScrollView>
    </Screen>
  )
}

const similarArtworksQuery = graphql`
  query BrowseSimilarWorksContentQuery($input: FilterArtworksInput, $first: Int) {
    artworksConnection(first: $first, input: $input) {
      edges {
        node {
          internalID
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

const SimilarArtworksContainer: React.FC<{ attributes: SearchCriteriaAttributes }> = withSuspense({
  Component: ({ attributes }) => {
    const data = useLazyLoadQuery<BrowseSimilarWorksContentQuery>(similarArtworksQuery, {
      first: NUMBER_OF_ARTWORKS_TO_SHOW,
      input: {
        ...attributes,
        forSale: true,
        sort: "-published_at",
      } as FilterArtworksInput,
    })

    if (!data || !data.artworksConnection) {
      return (
        <SimpleMessage>
          There aren’t any works available that meet the criteria at this time.
        </SimpleMessage>
      )
    }

    const artworks = extractNodes(data.artworksConnection)

    return (
      <>
        <GenericGrid artworks={artworks} />
        <Spacer y={2} />
        <BrowseSimilarWorksExploreMoreButton attributes={attributes} />
      </>
    )
  },
  LoadingFallback: SimilarArtworksPlaceholder,
  ErrorFallback: () => {
    return (
      <SimpleMessage>
        There aren’t any works available that meet the criteria at this time.
      </SimpleMessage>
    )
  },
})

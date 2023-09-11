import { Flex, Pill, Text, useTheme, Box, Spacer, Button } from "@artsy/palette-mobile"
import { ArtworkBrowseSimilarWorksQuery } from "__generated__/ArtworkBrowseSimilarWorksQuery.graphql"
import { ArtworkBrowseSimilarWorks_artworksConnection$data } from "__generated__/ArtworkBrowseSimilarWorks_artworksConnection.graphql"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import GenericGrid, { GenericGridPlaceholder } from "app/Components/ArtworkGrids/GenericGrid"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { goBack, navigate } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks/useScreenDimensions"
import { PlaceholderBox, PlaceholderRaggedText } from "app/utils/placeholders"
import { ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

export const NUMBER_OF_ARTWORKS_TO_SHOW = 10

interface SimilarWorksrops {
  artworksConnection: ArtworkBrowseSimilarWorks_artworksConnection$data
  artistNames: string[]
}

const SimilarWorks: React.FC<SimilarWorksrops> = ({ artworksConnection, artistNames }) => {
  const artworksConnectionNodes = extractNodes(artworksConnection)
  const screen = useScreenDimensions()
  const { space } = useTheme()
  const { bottom: bottomInset } = useSafeAreaInsets()

  return (
    <Box flex={1}>
      <FancyModalHeader onLeftButtonPress={goBack}>{`Works by ${artistNames}`}</FancyModalHeader>
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
          <Pill variant="filter" disabled mr={1}>
            Label
          </Pill>
        </Flex>
        <GenericGrid
          width={screen.width - space(2)}
          artworks={artworksConnectionNodes}
          onPress={(slug: string) => {
            navigate(`artwork/${slug}`)
          }}
        />
        <Button mt={2} block>
          Explore more on Artsy
        </Button>
      </ScrollView>
    </Box>
  )
}

const SimilarWorksFragmentContainer = createFragmentContainer(SimilarWorks, {
  artworksConnection: graphql`
    fragment ArtworkBrowseSimilarWorks_artworksConnection on FilterArtworksConnection {
      edges {
        node {
          ...GenericGrid_artworks
        }
      }
    }
  `,
})

interface ArtworkBrowseSimilarWorksQueryRendererProps {
  inputProps: SearchCriteriaAttributes
  artistNames: string[]
}

export const ArtworkBrowseSimilarWorksQueryRenderer: React.FC<
  ArtworkBrowseSimilarWorksQueryRendererProps
> = ({ inputProps, artistNames }) => {
  return (
    <QueryRenderer<ArtworkBrowseSimilarWorksQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query ArtworkBrowseSimilarWorksQuery($input: FilterArtworksInput) {
          artworksConnection(input: $input) {
            ...ArtworkBrowseSimilarWorks_artworksConnection
          }
        }
      `}
      variables={{
        input: {
          first: NUMBER_OF_ARTWORKS_TO_SHOW,
          sort: "-published_at",
          forSale: true,
          ...inputProps,
        },
      }}
      render={({ props, error }) => {
        if (error) {
          console.error(error)
          return null
        }

        if (!props?.artworksConnection) {
          return <Placeholder />
        }
        return (
          <SimilarWorksFragmentContainer
            artworksConnection={props.artworksConnection}
            artistNames={artistNames}
          />
        )
      }}
    />
  )
}

const Placeholder: React.FC = () => {
  const screen = useScreenDimensions()
  const { space } = useTheme()
  return (
    <Box flex={1}>
      <FancyModalHeader onLeftButtonPress={goBack} />
      <Box p={2}>
        <PlaceholderRaggedText numLines={2} textHeight={25} />
        <Spacer y={1} />
        <PlaceholderBox width={60} height={30} />
        <Spacer y={2} />
        <GenericGridPlaceholder width={screen.width - space(4)} />
      </Box>
    </Box>
  )
}

import { Flex, Pill, Text, useTheme } from "@artsy/palette-mobile"
import { ArtworkBrowseSimilarWorksQuery } from "__generated__/ArtworkBrowseSimilarWorksQuery.graphql"
import { ArtworkBrowseSimilarWorks_artworksConnection$data } from "__generated__/ArtworkBrowseSimilarWorks_artworksConnection.graphql"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import GenericGrid from "app/Components/ArtworkGrids/GenericGrid"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { goBack, navigate } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks/useScreenDimensions"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

export const NUMBER_OF_ARTWORKS_TO_SHOW = 10

interface SimilarWorksrops {
  artworksConnection: ArtworkBrowseSimilarWorks_artworksConnection$data
}

const SimilarWorks: React.FC<SimilarWorksrops> = ({ artworksConnection }) => {
  const artworksConnectionNodes = extractNodes(artworksConnection)
  const screen = useScreenDimensions()
  const { space } = useTheme()

  return (
    <>
      <FancyModalHeader onLeftButtonPress={goBack}>Works by</FancyModalHeader>
      <Flex mx={2}>
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
      </Flex>
    </>
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

interface ArtworkBrowseSimilarWorksQueryRendererProps extends SearchCriteriaAttributes {
  inputProps: SearchCriteriaAttributes
}

export const ArtworkBrowseSimilarWorksQueryRenderer: React.FC<
  ArtworkBrowseSimilarWorksQueryRendererProps
> = ({ inputProps }) => {
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
          // TODO: render Placeholder
          return <></>
        }
        return <SimilarWorksFragmentContainer artworksConnection={props.artworksConnection} />
      }}
    />
  )
}

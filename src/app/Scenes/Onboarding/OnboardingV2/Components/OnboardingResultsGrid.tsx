import { OnboardingResultsGridQuery } from "__generated__/OnboardingResultsGridQuery.graphql"
import { extractNodes } from "app/utils/extractNodes"
import { Box, Flex, OpaqueImageView, Text, TextProps } from "palette"
import { FC, useState } from "react"
import { Dimensions, LayoutChangeEvent, ScrollView } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"

const GRID_MARGIN = 20
const DEFAULT_ITEM_PADDING = 20
const BREAKPOINT = 700
const COLUMNS_SMALL = 2
const COLUMNS_LARGE = 3

export const OnboardingResultsGrid = () => {
  return <>OnboardingResultsQuiz</>
}

export const ArtworkGrid: FC = () => {
  const [itemWidth, setItemWidth] = useState<number>(calculateGridItemWidth())
  const { gene } = useLazyLoadQuery<OnboardingResultsGridQuery>(artworkGridQuery, {
    id: "artists-on-the-rise",
  })
  if (!gene?.artworks) {
    return null
  }
  const artworks = extractNodes(gene.artworks)

  const handleLayout = (event: LayoutChangeEvent) => {
    setItemWidth(calculateGridItemWidth(event.nativeEvent.layout.width))
  }

  return (
    <ScrollView onLayout={handleLayout}>
      <Flex flexDirection="row" flexWrap="wrap">
        {artworks.map((artwork) => {
          console.log(artwork)
          return <ArtworkItem artwork={artwork} key={artwork.slug} itemWidth={itemWidth} />
        })}
      </Flex>
    </ScrollView>
  )
}

const calculateGridItemWidth = (layoutWidth?: number) => {
  const width = layoutWidth ?? Dimensions.get("window").width
  const X = 2
  const columns = width > BREAKPOINT ? COLUMNS_LARGE : COLUMNS_SMALL
  const padding = DEFAULT_ITEM_PADDING * X * columns
  const margins = GRID_MARGIN * X * columns

  const gridWidth = width - margins
  const itemWidth = (gridWidth - padding) / columns

  console.log(itemWidth)

  return itemWidth
}

const artworkGridQuery = graphql`
  query OnboardingResultsGridQuery($id: String!) {
    gene(id: $id) {
      artworks: filterArtworksConnection(
        first: 10
        page: 1
        sort: "-decayed_merch"
        height: "*-*"
        width: "*-*"
        priceRange: "*-*"
        marketable: true
        offerable: true
        inquireableOnly: true
        forSale: true
      ) {
        edges {
          node {
            internalID
            slug
            date
            title
            artistNames
            partner {
              name
            }
            image {
              url
              aspectRatio
            }
            is_saved: isSaved
          }
        }
      }
    }
  }
`

interface ArtworkItemProps {
  artwork: any
  itemWidth: number
}

export const ArtworkItem: FC<ArtworkItemProps> = ({ artwork, itemWidth }) => {
  const { image } = artwork
  if (!image) {
    return null
  }
  const { url, aspectRatio } = image
  const height = itemWidth / aspectRatio

  return (
    <Box p={DEFAULT_ITEM_PADDING}>
      <OpaqueImageView aspectRatio={aspectRatio} imageURL={url} width={itemWidth} height={height} />
      <GridItemText>{artwork.artistNames}</GridItemText>
      <GridItemText color="black60">{artwork.title}</GridItemText>
      {/* <GridItemText>{artwork.date}</GridItemText> */}
      <GridItemText>{artwork.partner?.name}</GridItemText>
    </Box>
  )
}

const GridItemText: FC<TextProps> = ({ children, ...rest }) => {
  return (
    <Text lineHeight="18" weight="regular" variant="xs" numberOfLines={1} {...rest}>
      {children}
    </Text>
  )
}

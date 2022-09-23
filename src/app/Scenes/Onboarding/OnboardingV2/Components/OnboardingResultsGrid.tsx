import {
  OnboardingResultsGrid_connection$data,
  OnboardingResultsGrid_connection$key,
} from "__generated__/OnboardingResultsGrid_connection.graphql"
import { calculateLayoutValues, getSectionedItems } from "app/Components/ArtworkGrids/utils"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { useDoublePressCallback } from "app/Scenes/Artwork/Components/ImageCarousel/FullScreen/useDoublePressCallback"
import { extractNodes } from "app/utils/extractNodes"
import { Box, Flex, HeartFillIcon, HeartIcon, Text, TextProps, Touchable } from "palette"
import { FC } from "react"
import { Dimensions, ScrollView } from "react-native"
import { graphql, useFragment, useMutation } from "react-relay"

const DEFAULT_ITEM_PADDING = 20
const DEFAULT_ITEM_MARGIN = 20
const DEFAULT_SECTION_MARGIN = 20

export type GridItem = NonNullable<
  NonNullable<OnboardingResultsGrid_connection$data["edges"]>[number]
>["node"]

interface OnboardingResultsGridProps {
  connection: OnboardingResultsGrid_connection$key
}

export const OnboardingResultsGrid: FC<OnboardingResultsGridProps> = ({ connection }) => {
  const [commit] = useMutation(SaveArtworkMutation)
  if (!connection) {
    return null
  }

  const result = useFragment(OnboardingResultsGridFragment, connection)
  const gridItems = extractNodes(result)

  const { width } = Dimensions.get("window")
  const { sectionCount, sectionDimension } = calculateLayoutValues(width, DEFAULT_SECTION_MARGIN)

  const sectionedGridItems = getSectionedItems(gridItems, sectionCount)

  const handleSaveArtwork = useDoublePressCallback((artwork: GridItem) => {
    const { internalID, isSaved } = artwork!

    commit({
      variables: {
        input: {
          artworkID: internalID,
          remove: isSaved,
        },
      },
    })
  })

  const renderSections = () => {
    const sections: JSX.Element[] = []
    const columns = sectionCount ?? 0
    const itemWidth = sectionDimension
    for (let column = 0; column < columns; column++) {
      const items: JSX.Element[] = []
      for (let row = 0; row < sectionedGridItems[column].length; row++) {
        const artwork = sectionedGridItems[column][row]
        items.push(
          <Touchable key={artwork.slug} onPress={() => handleSaveArtwork(artwork)}>
            <GridItem artwork={artwork} itemWidth={itemWidth} p={DEFAULT_ITEM_PADDING} />
          </Touchable>
        )
        items.push(
          <Flex m={DEFAULT_ITEM_MARGIN} key={`spacer-${row}`} accessibilityLabel="Spacer View" />
        )
      }
      sections.push(
        <Flex
          flex={1}
          flexDirection="column"
          key={column}
          mr={column === columns - 1 ? 0 : DEFAULT_SECTION_MARGIN}
        >
          {items}
        </Flex>
      )
    }
    return sections
  }

  return (
    <ScrollView
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      scrollsToTop={false}
      accessibilityLabel="Artworks ScrollView"
    >
      <Flex flexDirection="row" pr={1} mt={2}>
        {renderSections()}
      </Flex>
      <Flex height={400} />
    </ScrollView>
  )
}

const SaveArtworkMutation = graphql`
  mutation OnboardingResultsGridSaveArtworkMutation($input: SaveArtworkInput!) {
    saveArtwork(input: $input) {
      artwork {
        id
        slug
        isSaved
      }
    }
  }
`

const OnboardingResultsGridFragment = graphql`
  fragment OnboardingResultsGrid_connection on FilterArtworksConnection {
    edges {
      node {
        internalID
        id
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
        isSaved
      }
    }
  }
`

interface GridItemProps extends TextProps {
  artwork: any
  itemWidth: number
}

const GridItem: FC<GridItemProps> = ({ artwork, itemWidth }) => {
  const { image } = artwork
  if (!image) {
    return null
  }
  const { url, aspectRatio } = image
  const height = itemWidth / aspectRatio

  return (
    <Box>
      <OpaqueImageView aspectRatio={aspectRatio} imageURL={url} width={itemWidth} height={height} />
      <Flex flex={1} flexDirection="row" pt={0.5} width={itemWidth}>
        <Flex justifySelf="flex-start" width={itemWidth - 16}>
          <GridItemText>{artwork.artistNames}</GridItemText>
          <GridItemText color="black60">{artwork.title}</GridItemText>
          <GridItemText>{artwork.date}</GridItemText>
          <GridItemText>{artwork.partner?.name}</GridItemText>
        </Flex>
        <Flex position="absolute" right={0} pt={0.5}>
          {!!artwork.isSaved ? <HeartFillIcon /> : <HeartIcon />}
        </Flex>
      </Flex>
    </Box>
  )
}

const GridItemText: FC<TextProps> = ({ children, ...rest }) => {
  return (
    <Text lineHeight="18" weight="regular" variant="xs" {...rest}>
      {children}
    </Text>
  )
}

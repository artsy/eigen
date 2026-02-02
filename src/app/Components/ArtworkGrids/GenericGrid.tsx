import { ContextModule } from "@artsy/cohesion"
import { Flex, TextProps, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { GenericGrid_artworks$key } from "__generated__/GenericGrid_artworks.graphql"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import Spinner from "app/Components/Spinner"
import { Stack } from "app/Components/Stack"
import { AnalyticsContextProvider } from "app/system/analytics/AnalyticsContext"
import { MasonryArtworkItem } from "app/utils/masonryHelpers"
import { RandomNumberGenerator } from "app/utils/placeholders"
import { times } from "lodash"
import React from "react"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"
import { ArtworkGridItemPlaceholder, ArtworkProps } from "./ArtworkGridItem"

interface Props {
  artistNamesTextStyle?: TextProps
  artworks: GenericGrid_artworks$key
  contextModule?: ContextModule
  hidePartner?: boolean
  isLoading?: boolean
  itemMargin?: number
  onPress?: (artworkID: string) => void
  trackTap?: (artworkSlug: string, itemIndex?: number) => void
  trackingFlow?: string
  saleInfoTextStyle?: TextProps
}

type PropsForArtwork = Omit<ArtworkProps, "artwork">

export const GenericGrid: React.FC<Props & PropsForArtwork> = ({
  artworks: artworksProp,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  contextScreenOwnerType,
  hidePartner = false,
  isLoading,
  onPress,
  trackTap,
  saleInfoTextStyle,
  trackingFlow,
}) => {
  const space = useSpace()
  const artworks = useFragment(genericGridFragment, artworksProp)

  return (
    <AnalyticsContextProvider
      contextScreenOwnerId={contextScreenOwnerId}
      contextScreenOwnerSlug={contextScreenOwnerSlug}
      contextScreenOwnerType={contextScreenOwnerType}
    >
      <Flex>
        <Flex accessibilityLabel="Artworks Content View" mx={-2}>
          <MasonryInfiniteScrollArtworkGrid
            artworks={artworks as unknown as MasonryArtworkItem[]}
            scrollEnabled={false}
            hidePartner={hidePartner}
            trackTap={trackTap}
            onPress={onPress}
            saleInfoTextStyle={saleInfoTextStyle}
            trackingFlow={trackingFlow}
          />
        </Flex>
        {isLoading ? <Spinner style={{ marginTop: space(2) }} testID="spinner" /> : null}
      </Flex>
    </AnalyticsContextProvider>
  )
}

const genericGridFragment = graphql`
  fragment GenericGrid_artworks on Artwork @relay(plural: true) {
    id
    slug
    image(includeAll: false) {
      aspectRatio
      blurhash
    }
    ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
  }
`

export default GenericGrid

export const GenericGridPlaceholder: React.FC<{ width: number }> = ({ width }) => {
  const numColumns = isTablet() ? 3 : 2
  const rng = new RandomNumberGenerator(3432)

  return (
    <Stack horizontal>
      {times(numColumns).map((i) => (
        <Stack key={i} spacing={4} width={(width + 20) / numColumns - 20}>
          {times(isTablet() ? 10 : 5).map((j) => (
            <ArtworkGridItemPlaceholder key={j} seed={rng.next()} />
          ))}
        </Stack>
      ))}
    </Stack>
  )
}

export const PlaceholderGrid = () => {
  const { width } = useScreenDimensions()
  return (
    <Flex mx={2} flexDirection="row" testID="PlaceholderGrid">
      <GenericGridPlaceholder width={width - 40} />
    </Flex>
  )
}

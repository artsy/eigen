import { tappedCollectedArtworkImages } from "@artsy/cohesion"
import { Flex, Join, NoImageIcon, Spacer, Text, useColor } from "@artsy/palette-mobile"
import { MyCollectionArtworkHeader_artwork$key } from "__generated__/MyCollectionArtworkHeader_artwork.graphql"
import { ImageCarouselFragmentContainer } from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarousel"
import { navigate } from "app/system/navigation/navigate"
import { useScreenDimensions } from "app/utils/hooks"
import { TouchableOpacity } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

const NO_ARTIST_NAMES_TEXT = "-"

interface MyCollectionArtworkHeaderProps {
  artwork: MyCollectionArtworkHeader_artwork$key
}

export const MyCollectionArtworkHeader: React.FC<MyCollectionArtworkHeaderProps> = (props) => {
  const artwork = useFragment(myCollectionArtworkHeaderFragment, props.artwork)
  const { artistNames, date, internalID, title, slug } = artwork

  const dimensions = useScreenDimensions()

  const color = useColor()

  const { trackEvent } = useTracking()

  const hasImages = artwork?.figures?.length > 0

  return (
    <Join separator={<Spacer y={2} />}>
      {hasImages ? (
        <ImageCarouselFragmentContainer
          figures={artwork?.figures}
          cardHeight={dimensions.height / 2}
          onImagePressed={() => trackEvent(tracks.tappedCollectedArtworkImages(internalID, slug))}
        />
      ) : (
        <Flex
          testID="MyCollectionArtworkHeaderFallback"
          bg={color("mono5")}
          height={dimensions.height / 2}
          justifyContent="center"
          mx={2}
        >
          <NoImageIcon fill="mono60" mx="auto" />
        </Flex>
      )}

      {/* Image Meta */}

      <Flex px={2}>
        {artwork?.artist?.isPersonalArtist ? (
          <Text variant="lg-display">{artistNames ?? NO_ARTIST_NAMES_TEXT}</Text>
        ) : (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => {
              if (artwork?.artist?.href) {
                navigate(artwork.artist.href)
              }
            }}
          >
            <Text variant="lg-display">{artistNames ?? NO_ARTIST_NAMES_TEXT}</Text>
          </TouchableOpacity>
        )}
        <Text variant="lg-display" color="mono60">
          <Text variant="lg-display" color="mono60" italic>
            {title}
          </Text>
          {!!date && `, ${date}`}
        </Text>
      </Flex>
    </Join>
  )
}

const myCollectionArtworkHeaderFragment = graphql`
  fragment MyCollectionArtworkHeader_artwork on Artwork {
    artist {
      href
      isPersonalArtist
    }
    artistNames
    date
    figures(includeAll: true) {
      ...ImageCarousel_figures
    }
    internalID
    slug
    title
  }
`

const tracks = {
  tappedCollectedArtworkImages: (internalID: string, slug: string) => {
    return tappedCollectedArtworkImages({ contextOwnerId: internalID, contextOwnerSlug: slug })
  },
}

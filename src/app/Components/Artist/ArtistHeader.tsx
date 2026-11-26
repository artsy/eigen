import {
  ActionType,
  ClickedVanguardBadge,
  ContextModule,
  OwnerType,
  TappedVerifiedRepresentative,
} from "@artsy/cohesion"
import {
  Box,
  Flex,
  Image,
  Pill,
  Spacer,
  Text,
  Theme,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import {
  ArtistHeader_artist$data,
  ArtistHeader_artist$key,
} from "__generated__/ArtistHeader_artist.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
import { FlatList, StyleSheet } from "react-native"
import { isTablet } from "react-native-device-info"
import LinearGradient from "react-native-linear-gradient"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

export const ARTIST_HEADER_HEIGHT = 156
export const ARTIST_IMAGE_PHONE_HEIGHT = 320
export const ARTIST_IMAGE_PHONE_ASPECT_RATIO = 1.17
export const ARTIST_IMAGE_TABLET_HEIGHT = 375

interface Props {
  artist: ArtistHeader_artist$key
}

export const useArtistHeaderImageDimensions = () => {
  const { width } = useScreenDimensions()

  const height = isTablet()
    ? ARTIST_IMAGE_TABLET_HEIGHT
    : ARTIST_IMAGE_PHONE_HEIGHT / ARTIST_IMAGE_PHONE_ASPECT_RATIO
  const aspectRatio = isTablet() ? width / height : ARTIST_IMAGE_PHONE_ASPECT_RATIO

  return {
    aspectRatio,
    height,
    width,
  }
}

export const ArtistHeader: React.FC<Props> = ({ artist }) => {
  const space = useSpace()

  const { width, height, aspectRatio } = useArtistHeaderImageDimensions()
  const { trackEvent } = useTracking()
  const artistData = useFragment(artistFragment, artist)

  if (!artistData) {
    return null
  }

  const descriptiveString = artistData.formattedNationalityAndBirthday || ""

  const bylineRequired = !!artistData.formattedNationalityAndBirthday

  const hasVerifiedRepresentatives = artistData.verifiedRepresentatives?.length > 0

  const cover = getCover(artistData)

  const vanguardArticleHref = artistData.vanguardArticle?.href
  const vanguardArticleSlug = artistData.vanguardArticle?.slug
  const vanguardBadge = <Pill color="mono0">{artistData.vanguardYear} Vanguard Artist</Pill>

  return (
    <Flex pointerEvents="box-none">
      {!!cover && (
        <Flex pointerEvents="box-none" pb={2}>
          <Flex pointerEvents="box-none">
            <Flex pointerEvents="none">
              <Image
                accessibilityLabel={cover.label}
                src={cover.url}
                aspectRatio={aspectRatio}
                width={width}
                height={height}
                style={{ alignSelf: "center" }}
                blurhash={cover.blurhash}
              />
            </Flex>
            {(!!cover.isStoryImage || !!artistData.vanguardYear) && (
              <LinearGradient
                testID="artist-header-gradient"
                colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.72)"]}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
            )}
            {!!artistData.vanguardYear && (
              <Theme theme="v3light">
                <Flex position="absolute" bottom={0} left={0} p={2} pointerEvents="box-none">
                  {vanguardArticleHref && vanguardArticleSlug ? (
                    <RouterLink
                      onPress={() => {
                        trackEvent(tracks.clickedVanguardBadge(artistData, vanguardArticleSlug))
                      }}
                      to={vanguardArticleHref}
                      hasChildTouchable
                    >
                      {vanguardBadge}
                    </RouterLink>
                  ) : (
                    vanguardBadge
                  )}
                </Flex>
              </Theme>
            )}
          </Flex>
        </Flex>
      )}
      <Box px={2} pointerEvents="none">
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
          <Flex flex={1}>
            <Text variant="lg-display">{artistData.name}</Text>
            {!!bylineRequired && (
              <Text variant="lg-display" color="mono60">
                {descriptiveString}
              </Text>
            )}
          </Flex>
        </Flex>
      </Box>

      {!!hasVerifiedRepresentatives && (
        <Flex pointerEvents="box-none">
          <Flex pointerEvents="none" px={2}>
            <Text pt={2} pb={1} variant="sm" color="mono60">
              Featured representation
            </Text>
          </Flex>
          <FlatList
            horizontal
            data={artistData.verifiedRepresentatives}
            keyExtractor={({ partner }) => `representative-${partner.internalID}`}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <RouterLink
                onPress={() => {
                  trackEvent(tracks.tappedVerifiedRepresentative(artistData, item.partner))
                }}
                to={item.partner.href}
                hasChildTouchable
              >
                <Pill variant="profile" src={item.partner.profile?.icon?.url ?? undefined}>
                  {item.partner.name}
                </Pill>
              </RouterLink>
            )}
            ItemSeparatorComponent={() => <Spacer x={1} />}
            contentContainerStyle={{
              paddingHorizontal: space(2),
            }}
          />
        </Flex>
      )}

      <Spacer y={2} />
    </Flex>
  )
}

const getCover = (artist: ArtistHeader_artist$data) => {
  const headerImage = artist.featuredStory?.headerImage
  if (headerImage?.image.url) {
    return {
      url: headerImage.image.url,
      blurhash: headerImage.image.blurhash,
      label: headerImage.altText,
      isStoryImage: true,
    }
  }

  const coverImage = artist.coverArtwork?.image
  if (coverImage?.url) {
    return {
      url: coverImage.url,
      blurhash: coverImage.blurhash,
      label: `${artist.name} cover image`,
      isStoryImage: false,
    }
  }

  return null
}

const artistFragment = graphql`
  fragment ArtistHeader_artist on Artist
  @argumentDefinitions(enableArtistStory: { type: "Boolean", defaultValue: false }) {
    featuredStory @include(if: $enableArtistStory) {
      headerImage {
        altText
        image {
          blurhash
          url(version: "larger")
        }
      }
    }
    vanguardYear @include(if: $enableArtistStory)
    vanguardArticle @include(if: $enableArtistStory) {
      href
      slug
    }
    slug
    formattedNationalityAndBirthday
    coverArtwork {
      title
      image {
        blurhash
        url(version: "larger")
      }
    }
    internalID
    name
    verifiedRepresentatives {
      partner {
        internalID
        name
        href
        profile {
          icon {
            url(version: "square140")
          }
        }
      }
    }
  }
`

export const tracks = {
  tappedVerifiedRepresentative: (
    artist: ArtistHeader_artist$data,
    partner: ArtistHeader_artist$data["verifiedRepresentatives"][number]["partner"]
  ): TappedVerifiedRepresentative => ({
    action: ActionType.tappedVerifiedRepresentative,
    context_module: ContextModule.artistHeader,
    context_screen_owner_type: OwnerType.artist,
    context_screen_owner_id: artist.internalID,
    destination_screen_owner_id: partner.internalID,
    destination_screen_owner_type: OwnerType.partner,
  }),
  clickedVanguardBadge: (
    artist: ArtistHeader_artist$data,
    articleSlug: string
  ): ClickedVanguardBadge => ({
    action: ActionType.clickedVanguardBadge,
    context_module: ContextModule.artistVanguardBadge,
    context_page_owner_type: OwnerType.artist,
    context_page_owner_id: artist.internalID,
    context_page_owner_slug: artist.slug,
    destination_page_owner_type: OwnerType.article,
    destination_page_owner_slug: articleSlug,
  }),
}

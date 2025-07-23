import { ShareIcon, NoArtIcon } from "@artsy/icons/native"
import {
  DEFAULT_HIT_SLOP,
  Flex,
  Image,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { useBottomSheet } from "@gorhom/bottom-sheet"
import { captureException } from "@sentry/react-native"
import { InfiniteDiscoveryNegativeSignals_artwork$key } from "__generated__/InfiniteDiscoveryNegativeSignals_artwork.graphql"
import { getShareURL } from "app/Components/ShareSheet/helpers"
import { useToast } from "app/Components/Toast/toastHook"
import { ACCESSIBLE_DEFAULT_ICON_SIZE } from "app/Components/constants"
import { useExcludeArtistFromDiscovery } from "app/Scenes/InfiniteDiscovery/hooks/useExcludeArtistFromDiscovery"
import { useInfiniteDiscoveryTracking } from "app/Scenes/InfiniteDiscovery/hooks/useInfiniteDiscoveryTracking"
import { GlobalStore } from "app/store/GlobalStore"
import { RouterLink } from "app/system/navigation/RouterLink"
import { FC } from "react"
import { Alert } from "react-native"
import RNShare from "react-native-share"
import { graphql, useFragment } from "react-relay"

interface InfiniteDiscoveryNegativeSignalsProps {
  artwork: InfiniteDiscoveryNegativeSignals_artwork$key
}

export const InfiniteDiscoveryNegativeSignals: FC<InfiniteDiscoveryNegativeSignalsProps> = ({
  artwork,
}) => {
  const data = useFragment(fragment, artwork)
  const { collapse } = useBottomSheet()
  const track = useInfiniteDiscoveryTracking()
  const { show } = useToast()
  const { setMoreInfoSheetVisible } = GlobalStore.actions.infiniteDiscovery
  const [commitMutation, isInFlight] = useExcludeArtistFromDiscovery()

  if (!data) {
    return null
  }

  const handleSharePressed = (
    id: string,
    slug: string,
    path: "artwork" | "artist",
    title: string
  ) => {
    track.tappedShare(id, slug)

    const url = getShareURL(
      `/${path}/${slug}?utm_content=discover-daily-share&utm_medium=product-share`
    )
    const message = `View ${title} on Artsy`

    RNShare.open({
      title,
      message: message + "\n" + url,
      failOnCancel: false,
    })
      .then((result) => {
        if (result.success) {
          track.share(id, slug, result.message)
        }
      })
      .catch((error) => {
        console.error("InfiniteDiscoveryNegativeSignals.tsx", error)
      })
  }

  const handleOnArtworkPress = async () => {
    setMoreInfoSheetVisible(false)
  }

  const handleSeeFewerArtistArtworks = () => {
    if (isInFlight || !data.artistNames) {
      return
    }

    Alert.alert(`Are you sure? You will no longer see works by ${data.artistNames}.`, undefined, [
      { text: "No" },
      {
        text: "Yes",
        onPress: () => {
          data.artists.forEach((artist) => {
            if (artist) {
              commitMutation({
                variables: { input: { artistId: artist.internalID } },
                onError: (e) => {
                  captureException(e, {
                    tags: {
                      source: "InfiniteDiscoveryNegativeSignals.tsx: handleSeeFewerArtistArtworks",
                    },
                  })
                  show("Something went wrong, try again", "bottom", { backgroundColor: "red100" })
                },
              })
            }
          })

          collapse()
        },
      },
    ])
  }

  const artist = data.artists?.[0]

  return (
    <Flex p={2} flex={1} gap={2}>
      <Flex flexDirection="row" gap={1} width="100%">
        <Flex height={60} width={50} flexShrink={0} alignSelf="center">
          {!!data.image?.url && (
            <RouterLink to={data.href} onPress={handleOnArtworkPress}>
              <Image
                height={60}
                width={50}
                src={data.image.url}
                aspectRatio={data.image.aspectRatio}
                blurhash={data.image.blurhash}
              />
            </RouterLink>
          )}
        </Flex>

        <RouterLink
          to={data.href}
          disablePrefetch
          style={{ flexWrap: "wrap", flex: 1 }}
          onPress={handleOnArtworkPress}
        >
          <Text variant="xs" color="mono100">
            {data.artistNames}
          </Text>

          <Text variant="xs" color="mono60" italic>
            {data.title}, {data.date}
          </Text>

          <Text variant="xs" color="mono100">
            {data.saleMessage}
          </Text>
        </RouterLink>

        <Flex justifyContent="center" alignItems="flex-end">
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Share artwork"
            onPress={() => handleSharePressed(data.internalID, data.slug, "artwork", data.title)}
            hitSlop={DEFAULT_HIT_SLOP}
          >
            <ShareIcon width={24} height={24} />
          </Touchable>
        </Flex>
      </Flex>

      {data.artists.length === 1 && !!artist && (
        <Touchable
          accessibilityRole="button"
          accessibilityLabel="Share artist"
          onPress={() => handleSharePressed(artist.internalID, artist.slug, "artist", artist.name)}
          hitSlop={DEFAULT_HIT_SLOP}
        >
          <Flex flexDirection="row" alignItems="center" gap={1} flexShrink={0}>
            <ShareIcon width={ACCESSIBLE_DEFAULT_ICON_SIZE} height={ACCESSIBLE_DEFAULT_ICON_SIZE} />
            <Text>Share Artist</Text>
          </Flex>
        </Touchable>
      )}

      <Touchable
        accessibilityRole="button"
        accessibilityLabel="See fewer artworks by this artist"
        onPress={handleSeeFewerArtistArtworks}
        hitSlop={DEFAULT_HIT_SLOP}
      >
        <Flex flexDirection="row" alignItems="center" gap={1}>
          <NoArtIcon width={ACCESSIBLE_DEFAULT_ICON_SIZE} height={ACCESSIBLE_DEFAULT_ICON_SIZE} />
          <Text>See fewer artworks by this artist</Text>
        </Flex>
      </Touchable>
    </Flex>
  )
}

const fragment = graphql`
  fragment InfiniteDiscoveryNegativeSignals_artwork on Artwork {
    artistNames @required(action: NONE)
    date
    href @required(action: NONE)
    internalID @required(action: NONE)
    slug @required(action: NONE)
    title @required(action: NONE)
    saleMessage @required(action: NONE)
    artists @required(action: NONE) {
      internalID @required(action: NONE)
      href @required(action: NONE)
      name @required(action: NONE)
      slug @required(action: NONE)
    }
    image(includeAll: false) {
      url(version: "medium")
      aspectRatio
      width
      height
      blurhash
    }
  }
`

export const InfiniteDiscoveryNegativeSignalsPlaceholder: FC = () => {
  return (
    <Flex flex={1}>
      <Flex p={2} flex={1}>
        <Skeleton>
          <Flex gap={2}>
            <Flex flexDirection="row" gap={1} width="100%">
              <SkeletonBox width={50} height={60} />

              <Flex flex={1}>
                <SkeletonText color="mono100" variant="xs">
                  Artist Name
                </SkeletonText>
                <SkeletonText variant="xs" color="mono100">
                  Artwork title, Date
                </SkeletonText>
                <SkeletonText variant="xs" color="mono100">
                  $1000,00
                </SkeletonText>
              </Flex>

              <Flex justifyContent="center" alignItems="flex-end">
                <SkeletonBox width={24} height={24} />
              </Flex>
            </Flex>

            <Flex flexDirection="row" alignItems="center" gap={1}>
              <SkeletonBox width={24} height={24} />
              <SkeletonText>Share Artist</SkeletonText>
            </Flex>

            <Flex flexDirection="row" alignItems="center" gap={1}>
              <SkeletonBox width={24} height={24} />
              <SkeletonText>See fewer artworks by this artist</SkeletonText>
            </Flex>
          </Flex>
        </Skeleton>
      </Flex>
    </Flex>
  )
}

import { ActionType, ContextModule, OwnerType, TappedVerifiedRepresentative } from "@artsy/cohesion"
import {
  Box,
  Flex,
  Image,
  Pill,
  Spacer,
  Text,
  Touchable,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { useScreenScrollContext } from "@artsy/palette-mobile/dist/elements/Screen/ScreenScrollContext"
import { ArtistHeader_artist$data } from "__generated__/ArtistHeader_artist.graphql"
import { ArtistHeader_me$data } from "__generated__/ArtistHeader_me.graphql"
import { navigate } from "app/system/navigation/navigate"
import { isPad } from "app/utils/hardware"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { pluralize } from "app/utils/pluralize"
import { FlatList, LayoutChangeEvent, ViewProps } from "react-native"
import { RelayProp, createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

export const ARTIST_HEADER_HEIGHT = 156
export const ARTIST_IMAGE_TABLET_HEIGHT = 375
const ARTIST_HEADER_SCROLL_MARGIN = 100

interface Props {
  artist: ArtistHeader_artist$data
  me: ArtistHeader_me$data
  relay: RelayProp
  onLayoutChange?: ViewProps["onLayout"]
}

export const useArtistHeaderImageDimensions = () => {
  const { width } = useScreenDimensions()
  const isTablet = isPad()

  const height = isTablet ? ARTIST_IMAGE_TABLET_HEIGHT : width
  const aspectRatio = width / height

  return {
    aspectRatio,
    height,
    width,
  }
}

export const ArtistHeader: React.FC<Props> = ({ artist, me, onLayoutChange }) => {
  const space = useSpace()
  const { width, height, aspectRatio } = useArtistHeaderImageDimensions()
  const { updateScrollYOffset } = useScreenScrollContext()
  const showArtistsAlertsSetFeatureFlag = useFeatureFlag("ARShowArtistsAlertsSet")
  const tracking = useTracking()

  const getBirthdayString = () => {
    const birthday = artist.birthday
    if (!birthday) {
      return ""
    }

    const leadingSubstring = artist.nationality ? ", b." : ""

    if (birthday.includes("born")) {
      return birthday.replace("born", leadingSubstring)
    } else if (birthday.includes("Est.") || birthday.includes("Founded")) {
      return " " + birthday
    }

    return leadingSubstring + " " + birthday
  }

  const descriptiveString = (artist.nationality || "") + getBirthdayString()

  const bylineRequired = artist.nationality || artist.birthday

  const showAlertsSet =
    !!showArtistsAlertsSetFeatureFlag && Number(me?.savedSearchesConnection?.totalCount) > 0
  const hasVerifiedRepresentatives = artist.verifiedRepresentatives?.length > 0

  const handleOnLayout = ({ nativeEvent, ...rest }: LayoutChangeEvent) => {
    if (nativeEvent.layout.height > 0) {
      updateScrollYOffset(nativeEvent.layout.height - ARTIST_HEADER_SCROLL_MARGIN)
      onLayoutChange?.({ nativeEvent, ...rest })
    }
  }

  const handleRepresentativePress = (
    partner: ArtistHeader_artist$data["verifiedRepresentatives"][number]["partner"]
  ) => {
    if (partner?.href && partner?.internalID) {
      tracking.trackEvent(tracks.tappedVerifiedRepresentative(artist, partner))
      navigate(partner.href)
    }
  }

  return (
    <Flex pointerEvents="box-none" onLayout={handleOnLayout}>
      {!!artist.coverArtwork?.image?.url && (
        <Flex pointerEvents="none">
          <Image
            accessibilityLabel={`${artist.name} cover image`}
            src={artist.coverArtwork.image.url}
            aspectRatio={aspectRatio}
            width={width}
            height={height}
            style={{ alignSelf: "center" }}
          />
          <Spacer y={2} />
        </Flex>
      )}
      <Box px={2} pointerEvents="none">
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
          <Flex flex={1}>
            <Text variant="lg">{artist.name}</Text>
            {!!bylineRequired && (
              <Text variant="lg" color="black60">
                {descriptiveString}
              </Text>
            )}
          </Flex>
        </Flex>
      </Box>

      {!!hasVerifiedRepresentatives && (
        <Flex pointerEvents="box-none">
          <Flex pointerEvents="none" px={2}>
            <Text pt={2} pb={1} variant="sm" color="black60">
              Featured representation
            </Text>
          </Flex>
          <FlatList
            horizontal
            data={artist.verifiedRepresentatives}
            keyExtractor={({ partner }) => `representative-${partner.internalID}`}
            renderItem={({ item }) => (
              <Pill
                variant="profile"
                src={item.partner.profile?.icon?.url!}
                onPress={() => handleRepresentativePress(item.partner)}
              >
                {item.partner.name}
              </Pill>
            )}
            ItemSeparatorComponent={() => <Spacer x={1} />}
            contentContainerStyle={{
              paddingHorizontal: space(2),
            }}
          />
          <Spacer y={2} />
        </Flex>
      )}

      {!!showAlertsSet && (
        <Box mx={2} maxWidth={120}>
          <Touchable
            haptic
            onPress={() => {
              navigate(`/my-profile/saved-search-alerts?artistID=${artist.internalID}`)
            }}
          >
            <Text variant="xs" color="blue100">
              {me.savedSearchesConnection!.totalCount}{" "}
              {pluralize("Alert", me.savedSearchesConnection!.totalCount!)} Set
            </Text>
          </Touchable>
        </Box>
      )}
    </Flex>
  )
}

export const ArtistHeaderFragmentContainer = createFragmentContainer(ArtistHeader, {
  artist: graphql`
    fragment ArtistHeader_artist on Artist {
      slug
      birthday
      coverArtwork {
        image {
          url(version: "large")
        }
      }
      internalID
      name
      nationality
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
  `,
  me: graphql`
    fragment ArtistHeader_me on Me @argumentDefinitions(artistID: { type: "String!" }) {
      savedSearchesConnection(first: 0, artistIDs: [$artistID]) {
        totalCount
      }
    }
  `,
})

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
}

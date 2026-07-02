import { Flex, Join, Spacer } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { ArtistListItemNew_artist$key } from "__generated__/ArtistListItemNew_artist.graphql"
import { FollowArtistsOrderedSetQuery } from "__generated__/FollowArtistsOrderedSetQuery.graphql"
import { ArtistListItemPlaceholder } from "app/Components/ArtistListItem"
import { SCROLLVIEW_PADDING_BOTTOM_OFFSET } from "app/Components/constants"
import { ArtistListItemNew } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/Components/ArtistListItem"
import { OnboardingPartnerListItem } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/Components/OnboardingPartnerListItem"
import { useOnboardingTracking } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/Hooks/useOnboardingTracking"
import { ONBOARDING_AVATAR_SIZE as AVATAR_SIZE } from "app/Scenes/Onboarding/Screens/constants"
import { OnboardingFollowedArtist } from "app/store/OnboardingModel"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { isEmpty, times } from "lodash"
import { Suspense } from "react"
import { FlatList } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"

interface FollowArtistsOrderedSetProps {
  id: string
  hideFollowedArtists?: boolean
  listHeaderComponent?: React.ReactElement
  onArtistFollowed?: (
    artistRef: ArtistListItemNew_artist$key,
    artist: OnboardingFollowedArtist
  ) => void
  onArtistUnfollowed?: (internalID: string) => void
}

const FollowArtistsOrderedSet: React.FC<FollowArtistsOrderedSetProps> = ({
  id,
  hideFollowedArtists,
  listHeaderComponent,
  onArtistFollowed,
  onArtistUnfollowed,
}) => {
  const { getId } = useNavigation()
  const { trackArtistFollow, trackGalleryFollow } = useOnboardingTracking()

  const { orderedSets } = useLazyLoadQuery<FollowArtistsOrderedSetQuery>(
    FollowArtistsOrderedSetScreenQuery,
    { key: id, imageSize: AVATAR_SIZE }
  )

  if (!orderedSets || orderedSets.length === 0) return null

  const orderedSet = orderedSets[0]?.orderedSet
  if (isEmpty(orderedSet)) return null

  const allNodes = extractNodes(orderedSet)
  const nodes = hideFollowedArtists
    ? allNodes.filter((node) => node.__typename !== "Artist" || !node.isFollowed)
    : allNodes

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: SCROLLVIEW_PADDING_BOTTOM_OFFSET }}
      ListHeaderComponent={listHeaderComponent}
      data={nodes}
      ItemSeparatorComponent={() => <Spacer y={2} />}
      renderItem={({ item }) => {
        switch (item.__typename) {
          case "Artist":
            return (
              <ArtistListItemNew
                artist={item}
                onFollow={() => {
                  trackArtistFollow(false, item.internalID, getId() ?? "")
                  onArtistFollowed?.(item, {
                    internalID: item.internalID,
                    imageUrl: item.coverArtwork?.image?.cropped?.src ?? null,
                    blurhash: item.coverArtwork?.image?.blurhash ?? null,
                  })
                }}
                onUnfollow={() => {
                  trackArtistFollow(true, item.internalID, getId() ?? "")
                  onArtistUnfollowed?.(item.internalID)
                }}
              />
            )
          case "Profile": {
            const partner = item.owner
            if (!partner || partner.__typename !== "Partner") return null
            return (
              <OnboardingPartnerListItem
                partner={partner}
                onFollow={() => {
                  trackGalleryFollow(false, item.internalID, getId() ?? "")
                }}
                onUnfollow={() => {
                  trackGalleryFollow(true, item.internalID, getId() ?? "")
                }}
              />
            )
          }
          default:
            return null
        }
      }}
      keyExtractor={(item, index) => {
        switch (item.__typename) {
          case "Artist":
            return item.internalID
          case "Profile":
            return item.internalID
          default:
            return item.__typename + index
        }
      }}
    />
  )
}

const Placeholder = () => (
  <ProvidePlaceholderContext>
    <Flex testID="FollowArtistsOrderedSetPlaceholder">
      <Join separator={<Spacer y={2} />}>
        {times(10).map((index: number) => (
          <Flex key={index}>
            <ArtistListItemPlaceholder />
          </Flex>
        ))}
      </Join>
    </Flex>
  </ProvidePlaceholderContext>
)

export const FollowArtistsOrderedSetScreen: React.FC<FollowArtistsOrderedSetProps> = (props) => (
  <Suspense fallback={<Placeholder />}>
    <FollowArtistsOrderedSet {...props} />
  </Suspense>
)

const FollowArtistsOrderedSetScreenQuery = graphql`
  query FollowArtistsOrderedSetQuery($key: String!, $imageSize: Int!) {
    orderedSets(key: $key) {
      orderedSet: orderedItemsConnection(first: 50) {
        edges {
          node {
            __typename
            ... on Artist {
              internalID
              isFollowed
              coverArtwork {
                image {
                  blurhash
                  cropped(width: $imageSize, height: $imageSize) {
                    src
                  }
                }
              }
              ...ArtistListItemNew_artist @arguments(imageSize: $imageSize)
            }
            ... on Profile {
              internalID
              isFollowed
              owner {
                __typename
                ... on Partner {
                  ...OnboardingPartnerListItem_partner
                }
              }
            }
          }
        }
      }
    }
  }
`

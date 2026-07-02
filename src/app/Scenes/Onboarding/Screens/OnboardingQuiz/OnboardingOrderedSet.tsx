import { Flex, Join, Spacer } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { OnboardingOrderedSetQuery } from "__generated__/OnboardingOrderedSetQuery.graphql"
import { ArtistListItemPlaceholder } from "app/Components/ArtistListItem"
import { SCROLLVIEW_PADDING_BOTTOM_OFFSET } from "app/Components/constants"
import { useOnboardingTracking } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/Hooks/useOnboardingTracking"
import { ONBOARDING_AVATAR_SIZE as AVATAR_SIZE } from "app/Scenes/Onboarding/Screens/constants"
import { OnboardingFollowedArtist } from "app/store/OnboardingModel"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { isEmpty, times } from "lodash"
import { Suspense } from "react"
import { FlatList } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistListItemNew } from "./Components/ArtistListItem"
import { OnboardingPartnerListItem } from "./Components/OnboardingPartnerListItem"
import { useOnboardingContext } from "./Hooks/useOnboardingContext"

interface OnboardingOrderedSetProps {
  id: string
  hideFollowedArtists?: boolean
  listHeaderComponent?: React.ReactElement
  onArtistFollowed?: (artist: OnboardingFollowedArtist, wasFollowed: boolean) => void
}

const OnboardingOrderedSet: React.FC<OnboardingOrderedSetProps> = ({
  id,
  hideFollowedArtists,
  listHeaderComponent,
  onArtistFollowed,
}) => {
  const { getId } = useNavigation()
  const { trackArtistFollow, trackGalleryFollow } = useOnboardingTracking()
  const { dispatch } = useOnboardingContext()
  const { orderedSets } = useLazyLoadQuery<OnboardingOrderedSetQuery>(
    OnboardingOrderedSetScreenQuery,
    {
      key: id,
      imageSize: AVATAR_SIZE,
    }
  )

  if (!orderedSets || orderedSets.length === 0) {
    return null
  }

  const orderedSet = orderedSets[0]?.orderedSet

  if (isEmpty(orderedSet)) {
    return null
  }

  const allNodes = extractNodes(orderedSet)
  const nodes = hideFollowedArtists
    ? allNodes.filter((node) => node.__typename !== "Artist" || !node.isFollowed)
    : allNodes

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: SCROLLVIEW_PADDING_BOTTOM_OFFSET,
      }}
      ListHeaderComponent={listHeaderComponent}
      data={nodes}
      ItemSeparatorComponent={() => <Spacer y={2} />}
      renderItem={({ item }) => {
        switch (item.__typename) {
          case "Artist":
            return (
              <ArtistListItemNew
                artist={item}
                onFollow={(wasFollowed) => {
                  trackArtistFollow(wasFollowed, item.internalID, getId() ?? "")
                  dispatch({ type: "FOLLOW", payload: item.internalID })
                  onArtistFollowed?.(
                    {
                      internalID: item.internalID,
                      imageUrl: item.coverArtwork?.image?.cropped?.src ?? null,
                      blurhash: item.coverArtwork?.image?.blurhash ?? null,
                    },
                    wasFollowed
                  )
                }}
              />
            )
          case "Profile": {
            const partner = item.owner

            if (!partner || partner.__typename !== "Partner") {
              return null
            }

            return (
              <OnboardingPartnerListItem
                partner={partner}
                onFollow={(wasFollowed) => {
                  trackGalleryFollow(wasFollowed, item.internalID, getId() ?? "")
                  dispatch({ type: "FOLLOW", payload: item.internalID })
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

const OnboardingPersonalizationListPlaceholder = () => (
  <ProvidePlaceholderContext>
    <Flex testID="OnboardingPersonalizationListPlaceholder">
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

export const OnboardingOrderedSetScreen: React.FC<OnboardingOrderedSetProps> = (props) => (
  <Suspense fallback={<OnboardingPersonalizationListPlaceholder />}>
    <OnboardingOrderedSet {...props} />
  </Suspense>
)

const OnboardingOrderedSetScreenQuery = graphql`
  query OnboardingOrderedSetQuery($key: String!, $imageSize: Int!) {
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
                  url
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

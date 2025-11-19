import { Flex, Join, Spacer } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { OnboardingOrderedSetQuery } from "__generated__/OnboardingOrderedSetQuery.graphql"
import { ArtistListItemPlaceholder } from "app/Components/ArtistListItem"
import { SCROLLVIEW_PADDING_BOTTOM_OFFSET } from "app/Components/constants"
import { useOnboardingTracking } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/Hooks/useOnboardingTracking"
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
}

const OnboardingOrderedSet: React.FC<OnboardingOrderedSetProps> = ({ id }) => {
  const { getId } = useNavigation()
  const { trackArtistFollow, trackGalleryFollow } = useOnboardingTracking()
  const { dispatch } = useOnboardingContext()
  const { orderedSets } = useLazyLoadQuery<OnboardingOrderedSetQuery>(
    OnboardingOrderedSetScreenQuery,
    {
      key: id,
    }
  )

  const orderedSet = orderedSets![0]?.orderedSet

  if (isEmpty(orderedSet)) {
    return null
  }

  const nodes = extractNodes(orderedSet)

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: SCROLLVIEW_PADDING_BOTTOM_OFFSET,
      }}
      data={nodes}
      ItemSeparatorComponent={() => <Spacer y={2} />}
      renderItem={({ item }) => {
        switch (item.__typename) {
          case "Artist":
            return (
              <ArtistListItemNew
                artist={item}
                onFollow={() => {
                  trackArtistFollow(!!item.isFollowed, item.internalID, getId()!)
                  dispatch({ type: "FOLLOW", payload: item.internalID })
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
                onFollow={() => {
                  trackGalleryFollow(!!item.isFollowed, item.internalID, getId()!)
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
  query OnboardingOrderedSetQuery($key: String!) {
    orderedSets(key: $key) {
      orderedSet: orderedItemsConnection(first: 50) {
        edges {
          node {
            __typename
            ... on Artist {
              internalID
              isFollowed
              ...ArtistListItemNew_artist
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

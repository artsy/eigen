import { OnboardingOrderedSetQuery } from "__generated__/OnboardingOrderedSetQuery.graphql"
import { ArtistListItemPlaceholder } from "app/Components/ArtistListItem"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { isEmpty, times } from "lodash"
import { Flex, Join, Spacer } from "palette"
import { Suspense } from "react"
import { FlatList } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistListItemNew } from "./ArtistListItem"
import { useOnboardingContext } from "./Hooks/useOnboardingContext"
import { PartnerListItem } from "./PartnerListItem"

interface OnboardingOrderedSetProps {
  id: string
}

const OnboardingOrderedSet: React.FC<OnboardingOrderedSetProps> = ({ id }) => {
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
        paddingBottom: 80,
      }}
      data={nodes}
      ItemSeparatorComponent={() => <Spacer mt={2} />}
      renderItem={({ item }) => {
        switch (item.__typename) {
          case "Artist":
            return (
              <ArtistListItemNew
                artist={item}
                onFollow={() => {
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
              <PartnerListItem
                partner={partner}
                onFollow={() => {
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
      <Join separator={<Spacer height={20} />}>
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
              ...ArtistListItemNew_artist
            }
            ... on Profile {
              internalID
              owner {
                __typename
                ... on Partner {
                  ...PartnerListItem_partner
                }
              }
            }
          }
        }
      }
    }
  }
`

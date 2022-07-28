import { OnboardingOrderedSetQuery } from "__generated__/OnboardingOrderedSetQuery.graphql"
import { ArtistListItemPlaceholder } from "app/Components/ArtistListItem"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { isEmpty, times } from "lodash"
import { Flex, Join, Spacer, useSpace } from "palette"
import { Suspense } from "react"
import { FlatList, SafeAreaView } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistListItemNew } from "./ArtistListItem"

interface OnboardingOrderedSetProps {
  id: string
}

const OnboardingOrderedSet: React.FC<OnboardingOrderedSetProps> = ({ id }) => {
  const { orderedSets } = useLazyLoadQuery<OnboardingOrderedSetQuery>(
    OnboardingOrderedSetScreenQuery,
    {
      key: id,
    }
  )
  const space = useSpace()

  const orderedSet = orderedSets![0]?.orderedSet

  if (isEmpty(orderedSet)) {
    return null
  }

  const nodes = extractNodes(orderedSet)

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <FlatList
        contentContainerStyle={{
          paddingTop: space(1),
          paddingBottom: 80,
        }}
        data={nodes}
        renderItem={({ item }) => {
          switch (item.__typename) {
            case "Artist":
              return <ArtistListItemNew artist={item} py={space(1)} />
            default:
              return null
          }
        }}
        keyExtractor={(item, index) => {
          switch (item.__typename) {
            case "Artist":
              return item.internalID
          }
          return item.__typename + index
        }}
      />
    </SafeAreaView>
  )
}

const OnboardingPersonalizationListPlaceholder = () => (
  <ProvidePlaceholderContext>
    <SafeAreaView
      style={{
        flexGrow: 1,
      }}
    >
      <Spacer height={60} />
      <Flex px={2} mt={2}>
        <Join separator={<Spacer height={20} />}>
          {times(10).map((index: number) => (
            <Flex key={index}>
              <ArtistListItemPlaceholder />
            </Flex>
          ))}
        </Join>
      </Flex>
    </SafeAreaView>
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
          }
        }
      }
    }
  }
`

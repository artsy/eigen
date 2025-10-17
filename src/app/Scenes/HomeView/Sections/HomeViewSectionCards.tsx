import { ContextModule } from "@artsy/cohesion"
import { Flex, Text } from "@artsy/palette-mobile"
import { HomeViewSectionCardsQuery } from "__generated__/HomeViewSectionCardsQuery.graphql"
import { HomeViewSectionCards_section$key } from "__generated__/HomeViewSectionCards_section.graphql"
import { CardRailCard, CardRailMetadataContainer } from "app/Components/CardRail/CardRailCard"
import {
  CardRailFlatList,
  CardRailFlatListPlaceholder,
} from "app/Components/CardRail/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { ThreeUpImageLayout } from "app/Components/ThreeUpImageLayout"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { HORIZONTAL_FLATLIST_WINDOW_SIZE } from "app/Scenes/HomeView/helpers/constants"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionCardsProps {
  section: HomeViewSectionCards_section$key
  index: number
}

export const HomeViewSectionCards: React.FC<HomeViewSectionCardsProps> = ({
  section: sectionProp,
  index,
  ...flexProps
}) => {
  const section = useFragment(HomeViewSectionCardsFragment, sectionProp)
  const cards = extractNodes(section.cardsConnection)

  if (!section || cards.length === 0) {
    return null
  }

  const viewAll = section.component?.behaviors?.viewAll

  return (
    <Flex {...flexProps}>
      <SectionTitle
        href={viewAll?.href || "/auctions"}
        mx={2}
        title={section.component?.title}
        onPress={() => {
          /* track */
        }}
      />

      <CardRailFlatList
        data={cards}
        initialNumToRender={3}
        windowSize={HORIZONTAL_FLATLIST_WINDOW_SIZE}
        renderItem={({ item, index }) => {
          const imageURLs =
            item.images?.map((img) => img?.imageURL).filter((url): url is string => !!url) || []

          return (
            <Flex>
              <CardRailCard key={index}>
                <RouterLink
                  to={item.href || "/auctions"}
                  onPress={() => {
                    /* track */
                  }}
                >
                  <ThreeUpImageLayout imageURLs={imageURLs} />
                  <CardRailMetadataContainer>
                    <Text key={index} color={imageURLs.length === 0 ? "mono30" : "mono100"}>
                      {item?.title}
                    </Text>
                  </CardRailMetadataContainer>
                </RouterLink>
              </CardRailCard>
            </Flex>
          )
        }}
      />

      <HomeViewSectionSentinel
        contextModule={section.contextModule as ContextModule}
        index={index}
      />
    </Flex>
  )
}

const HomeViewSectionCardsFragment = graphql`
  fragment HomeViewSectionCards_section on HomeViewSectionCards {
    __typename
    internalID
    contextModule
    component {
      title
      description
      behaviors {
        viewAll {
          href
          ownerType
        }
      }
    }
    cardsConnection(first: 3) {
      edges {
        node {
          entityID
          entityType
          href
          title
          images {
            blurhash
            imageURL
          }
        }
      }
    }
  }
`

const homeViewSectionCardsQuery = graphql`
  query HomeViewSectionCardsQuery($id: String!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionCards_section
      }
    }
  }
`

export const HomeViewSectionCardsQueryRenderer: React.FC<SectionSharedProps> = withSuspense({
  Component: ({ sectionID, index, ...flexProps }) => {
    const data = useLazyLoadQuery<HomeViewSectionCardsQuery>(
      homeViewSectionCardsQuery,
      {
        id: sectionID,
      },
      {
        networkCacheConfig: {
          force: false,
        },
      }
    )

    if (!data.homeView.section) {
      return null
    }

    return <HomeViewSectionCards section={data.homeView.section} index={index} {...flexProps} />
  },
  LoadingFallback: CardRailFlatListPlaceholder,
  ErrorFallback: NoFallback,
})

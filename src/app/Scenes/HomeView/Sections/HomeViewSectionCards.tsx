import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import { Flex, Text } from "@artsy/palette-mobile"
import { HomeViewSectionCardsQuery } from "__generated__/HomeViewSectionCardsQuery.graphql"
import { HomeViewSectionCards_section$key } from "__generated__/HomeViewSectionCards_section.graphql"
import { CardRailCard, CardRailMetadataContainer } from "app/Components/CardRail/CardRailCard"
import {
  CardRailFlatList,
  CardRailFlatListPlaceholder,
} from "app/Components/CardRail/CardRailFlatList"
import { MultipleImageLayout } from "app/Components/MultipleImageLayout"
import { SectionTitle } from "app/Components/SectionTitle"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { HomeViewStore } from "app/Scenes/HomeView/HomeViewContext"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { HORIZONTAL_FLATLIST_WINDOW_SIZE } from "app/Scenes/HomeView/helpers/constants"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { useItemsImpressionsTracking } from "app/Scenes/HomeView/hooks/useImpressionsTracking"
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
  const tracking = useHomeViewTracking()

  const viewableSections = HomeViewStore.useStoreState((state) => state.viewableSections)

  const { onViewableItemsChanged, viewabilityConfig } = useItemsImpressionsTracking({
    // It is important here to tell if the rail is visible or not, because the viewability config
    // default behavior, doesn't take into account the fact that the rail could be not visible
    // on the screen because it's within a scrollable container.
    isInViewport: viewableSections.includes(section.internalID) && section.trackItemImpressions,
    contextModule: section.contextModule as ContextModule,
    itemType: "card",
  })

  if (!section || cards.length === 0) {
    return null
  }

  const viewAll = section.component?.behaviors?.viewAll

  // TODO: track Your Auction Picks item tap on the auctions screen

  return (
    <Flex {...flexProps}>
      <SectionTitle
        href={viewAll?.href || "/auctions"}
        mx={2}
        title={section.component?.title}
        onPress={() => {
          tracking.tappedCardGroupViewAll(
            section.contextModule as ContextModule,
            viewAll?.ownerType as ScreenOwnerType
          )
        }}
      />

      <CardRailFlatList
        data={cards}
        initialNumToRender={3}
        keyExtractor={(_, index) => String(index)}
        windowSize={HORIZONTAL_FLATLIST_WINDOW_SIZE}
        onViewableItemsChanged={({ viewableItems, changed }) => {
          onViewableItemsChanged({ viewableItems, changed })
        }}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item, index }) => {
          const imageURLs =
            item.images?.map((img) => img?.imageURL).filter((url): url is string => !!url) || []

          const imagesToDisplay = imageURLs.length
            ? imageURLs
            : item.image?.imageURL
              ? [item.image.imageURL]
              : []

          const Card = (
            <>
              <MultipleImageLayout imageURLs={imagesToDisplay} />
              <CardRailMetadataContainer>
                <Text color={imageURLs.length === 0 ? "mono30" : "mono100"}>{item?.title}</Text>
              </CardRailMetadataContainer>
            </>
          )

          return (
            <Flex>
              <CardRailCard>
                {imageURLs.length > 0 ? (
                  <RouterLink
                    to={item.href || "/auctions"}
                    onPress={() => {
                      tracking.tappedCardGroup(
                        item.entityID as string,
                        item.entityType as ScreenOwnerType,
                        item.href as string,
                        item.contextModule as ContextModule,
                        index
                      )
                    }}
                  >
                    {Card}
                  </RouterLink>
                ) : (
                  Card
                )}
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
    trackItemImpressions
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
          contextModule
          href
          title
          image {
            imageURL
          }
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

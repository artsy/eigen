import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { HomeViewSectionSalesQuery } from "__generated__/HomeViewSectionSalesQuery.graphql"
import { HomeViewSectionSales_section$key } from "__generated__/HomeViewSectionSales_section.graphql"
import { BrowseMoreRailCard } from "app/Components/BrowseMoreRailCard"
import {
  CardRailFlatList,
  CardRailFlatListPlaceholder,
} from "app/Components/CardRail/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { HomeViewSectionSalesItem } from "app/Scenes/HomeView/Sections/HomeViewSectionSalesItem"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import {
  HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT,
  HORIZONTAL_FLATLIST_WINDOW_SIZE,
} from "app/Scenes/HomeView/helpers/constants"
import { getHomeViewSectionHref } from "app/Scenes/HomeView/helpers/getHomeViewSectionHref"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { memo, useRef } from "react"
import { FlatList } from "react-native-gesture-handler"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionSalesProps {
  section: HomeViewSectionSales_section$key
  index: number
}

export const HomeViewSectionSales: React.FC<HomeViewSectionSalesProps> = ({
  section: sectionProp,
  index,
  ...flexProps
}) => {
  const tracking = useHomeViewTracking()

  const listRef = useRef<FlatList<any>>(null)
  const section = useFragment(fragment, sectionProp)

  const sales = extractNodes(section.salesConnection)

  const viewAll = section.component?.behaviors?.viewAll
  const href = getHomeViewSectionHref(viewAll?.href, section)

  const onHeaderPress = () => {
    tracking.tappedAuctionGroupViewAll(
      section.contextModule as ContextModule,
      viewAll?.ownerType as ScreenOwnerType
    )
  }

  const onViewAllPress = () => {
    tracking.tappedAuctionGroupViewAll(
      section.contextModule as ContextModule,
      (viewAll?.ownerType || section.ownerType) as ScreenOwnerType
    )
  }

  if (sales.length === 0) return null

  return (
    <Flex {...flexProps}>
      <Flex px={2}>
        <SectionTitle
          href={href}
          title={section.component?.title}
          onPress={href ? onHeaderPress : undefined}
        />
      </Flex>

      <CardRailFlatList
        listRef={listRef}
        data={sales}
        initialNumToRender={HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT}
        windowSize={HORIZONTAL_FLATLIST_WINDOW_SIZE}
        renderItem={({ item, index }) => {
          return (
            <HomeViewSectionSalesItem
              sale={item}
              onPress={(sale) => {
                tracking.tappedAuctionGroup(
                  sale.internalID,
                  sale.slug,
                  section.contextModule as ContextModule,
                  index
                )
              }}
            />
          )
        }}
        ListFooterComponent={() =>
          viewAll ? (
            <BrowseMoreRailCard
              href={viewAll.href}
              onPress={onViewAllPress}
              text={viewAll.buttonText ?? "Browse All Auctions"}
            />
          ) : undefined
        }
      />

      <HomeViewSectionSentinel
        contextModule={section.contextModule as ContextModule}
        index={index}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment HomeViewSectionSales_section on HomeViewSectionSales {
    __typename
    internalID
    contextModule
    component {
      title
      behaviors {
        viewAll {
          buttonText
          href
          ownerType
        }
      }
    }
    ownerType

    salesConnection(first: 10) {
      edges {
        node {
          href
          slug
          ...HomeViewSectionSalesItem_sale
        }
      }
    }
  }
`

const homeViewSectionSalesQuery = graphql`
  query HomeViewSectionSalesQuery($id: String!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionSales_section
      }
    }
  }
`

export const HomeViewSectionSalesQueryRenderer: React.FC<SectionSharedProps> = memo(
  withSuspense({
    Component: ({ sectionID, index, ...flexProps }) => {
      const data = useLazyLoadQuery<HomeViewSectionSalesQuery>(
        homeViewSectionSalesQuery,
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

      return <HomeViewSectionSales section={data.homeView.section} index={index} {...flexProps} />
    },
    LoadingFallback: () => <CardRailFlatListPlaceholder numberOfLines={2} />,
    ErrorFallback: NoFallback,
  })
)

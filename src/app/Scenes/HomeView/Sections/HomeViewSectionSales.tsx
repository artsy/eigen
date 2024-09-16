import { Flex, useScreenDimensions } from "@artsy/palette-mobile"
import { HomeViewSectionSales_section$key } from "__generated__/HomeViewSectionSales_section.graphql"
import { BrowseMoreRailCard } from "app/Components/BrowseMoreRailCard"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT } from "app/Scenes/HomeView/HomeView"
import { HomeViewSectionSalesItem } from "app/Scenes/HomeView/Sections/HomeViewSectionSalesItem"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useRef } from "react"
import { FlatList } from "react-native-gesture-handler"
import { graphql, useFragment } from "react-relay"

interface HomeViewSectionSalesProps {
  section: HomeViewSectionSales_section$key
}

export const HomeViewSectionSales: React.FC<HomeViewSectionSalesProps> = ({ section }) => {
  const tracking = useHomeViewTracking()

  const listRef = useRef<FlatList<any>>()
  const data = useFragment(fragment, section)
  const component = data.component
  const componentHref = component?.behaviors?.viewAll?.href
  const sales = extractNodes(data.salesConnection)

  const { width } = useScreenDimensions()
  const isTablet = width > 700

  if (sales.length === 0) {
    return null
  }

  return (
    <Flex my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>
      <Flex px={2}>
        <SectionTitle
          title={component?.title}
          onPress={
            componentHref
              ? () => {
                  navigate(componentHref)
                }
              : undefined
          }
        />
      </Flex>
      <CardRailFlatList
        prefetchUrlExtractor={(item) => item?.href}
        prefetchVariablesExtractor={(item) => ({ saleSlug: item?.slug })}
        listRef={listRef}
        data={sales}
        initialNumToRender={isTablet ? 10 : 5}
        renderItem={({ item, index }) => {
          return (
            <HomeViewSectionSalesItem
              sale={item}
              onPress={(sale) => {
                tracking.tappedAuctionGroup(sale.internalID, sale.slug, data.internalID, index)
              }}
            />
          )
        }}
        ListFooterComponent={
          componentHref ? (
            <BrowseMoreRailCard
              onPress={() => {
                navigate(componentHref)
              }}
              text="Browse All Auctions"
            />
          ) : undefined
        }
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment HomeViewSectionSales_section on HomeViewSectionSales {
    internalID
    component {
      title
      behaviors {
        viewAll {
          href
        }
      }
    }

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

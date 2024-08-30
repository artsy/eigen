import { ContextModule } from "@artsy/cohesion"
import { Flex, useScreenDimensions } from "@artsy/palette-mobile"
import { SalesHomeViewSection_section$key } from "__generated__/SalesHomeViewSection_section.graphql"
import { BrowseMoreRailCard } from "app/Components/BrowseMoreRailCard"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { SalesItem } from "app/Scenes/HomeView/Sections/SalesItem"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useRef } from "react"
import { FlatList } from "react-native-gesture-handler"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface SalesHomeViewSectionProps {
  section: SalesHomeViewSection_section$key
}

export const SalesRailHomeViewSection: React.FC<SalesHomeViewSectionProps> = ({ section }) => {
  const tracking = useTracking()

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
    <Flex>
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
            <SalesItem
              sale={item}
              onPress={(sale) => {
                tracking.trackEvent(
                  HomeAnalytics.auctionThumbnailTapEvent(
                    sale?.internalID,
                    sale?.slug,
                    index,
                    data.internalID as ContextModule
                  )
                )
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
  fragment SalesHomeViewSection_section on SalesHomeViewSection {
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
          ...SalesItem_sale
        }
      }
    }
  }
`

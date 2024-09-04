import { ContextModule } from "@artsy/cohesion"
import { Flex, useScreenDimensions } from "@artsy/palette-mobile"
import { SalesRailHomeViewSection_section$key } from "__generated__/SalesRailHomeViewSection_section.graphql"
import { BrowseMoreRailCard } from "app/Components/BrowseMoreRailCard"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import LegacyHomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { SalesRailItem } from "app/Scenes/HomeView/Sections/SalesRailItem"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useRef } from "react"
import { FlatList } from "react-native-gesture-handler"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface SalesRailHomeViewSectionProps {
  section: SalesRailHomeViewSection_section$key
}

export const SalesRailHomeViewSection: React.FC<SalesRailHomeViewSectionProps> = ({ section }) => {
  const tracking = useTracking()

  const listRef = useRef<FlatList<any>>()
  const data = useFragment(fragment, section)
  const component = data.component
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
          onPress={() => {
            navigate(component?.behaviors?.viewAll?.href || "/auctions")
          }}
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
            <SalesRailItem
              sale={item}
              onPress={(sale) => {
                tracking.trackEvent(
                  LegacyHomeAnalytics.auctionThumbnailTapEvent(
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
          <BrowseMoreRailCard
            onPress={() => {
              navigate(component?.behaviors?.viewAll?.href || "/auctions")
            }}
            text={component?.behaviors?.viewAll?.buttonText || "Browse All Auctions"}
          />
        }
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment SalesRailHomeViewSection_section on SalesRailHomeViewSection {
    internalID
    component {
      title
      behaviors {
        viewAll {
          href
          buttonText
        }
      }
    }

    salesConnection(first: 10) {
      edges {
        node {
          href
          slug
          ...SalesRailItem_sale
        }
      }
    }
  }
`

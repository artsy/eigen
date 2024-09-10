import { Flex, useScreenDimensions } from "@artsy/palette-mobile"
import { SalesRailHomeViewSection_section$key } from "__generated__/SalesRailHomeViewSection_section.graphql"
import { BrowseMoreRailCard } from "app/Components/BrowseMoreRailCard"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { SalesRailItem } from "app/Scenes/HomeView/Sections/SalesRailItem"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useRef } from "react"
import { FlatList } from "react-native-gesture-handler"
import { graphql, useFragment } from "react-relay"

interface SalesRailHomeViewSectionProps {
  section: SalesRailHomeViewSection_section$key
}

export const SalesRailHomeViewSection: React.FC<SalesRailHomeViewSectionProps> = ({ section }) => {
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
        renderItem={({ item }) => {
          return <SalesRailItem sale={item} />
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
  fragment SalesRailHomeViewSection_section on SalesRailHomeViewSection {
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
          ...SalesRailItem_sale
        }
      }
    }
  }
`

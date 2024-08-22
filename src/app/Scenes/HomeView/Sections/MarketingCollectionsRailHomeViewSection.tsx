import { Flex } from "@artsy/palette-mobile"
import {
  MarketingCollectionsRailHomeViewSection_section$data,
  MarketingCollectionsRailHomeViewSection_section$key,
} from "__generated__/MarketingCollectionsRailHomeViewSection_section.graphql"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { MarketingCollectionRailItem } from "app/Scenes/HomeView/Sections/MarketingCollectionRailItem"
import { extractNodes } from "app/utils/extractNodes"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { graphql, useFragment } from "react-relay"

interface MarketingCollectionsRailHomeViewSectionProps {
  section: MarketingCollectionsRailHomeViewSection_section$key
}

export const MarketingCollectionsRailHomeViewSection: React.FC<
  MarketingCollectionsRailHomeViewSectionProps
> = ({ section }) => {
  const data = useFragment(fragment, section)
  const component = data.component

  if (!component) return null

  const marketingCollections = extractNodes(data.marketingCollectionsConnection)
  if (!marketingCollections || marketingCollections.length === 0) return null

  return (
    <Flex>
      <Flex pl={2} pr={2}>
        <SectionTitle title={component.title} />
      </Flex>

      <CardRailFlatList<
        ExtractNodeType<
          MarketingCollectionsRailHomeViewSection_section$data["marketingCollectionsConnection"]
        >
      >
        data={marketingCollections}
        initialNumToRender={3}
        renderItem={({ item }) => {
          return <MarketingCollectionRailItem key={item.internalID} marketingCollection={item} />
        }}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment MarketingCollectionsRailHomeViewSection_section on MarketingCollectionsRailHomeViewSection {
    component {
      title
    }

    marketingCollectionsConnection(first: 10) {
      edges {
        node {
          internalID
          ...MarketingCollectionRailItem_marketingCollection
        }
      }
    }
  }
`

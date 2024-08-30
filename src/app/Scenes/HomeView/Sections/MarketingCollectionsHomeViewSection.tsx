import { ContextModule } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import {
  MarketingCollectionsHomeViewSection_section$data,
  MarketingCollectionsHomeViewSection_section$key,
} from "__generated__/MarketingCollectionsHomeViewSection_section.graphql"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import LegacyHomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { MarketingCollectionItem } from "app/Scenes/HomeView/Sections/MarketingCollectionItem"
import { MarketingCollectionRailItem } from "app/Scenes/HomeView/Sections/MarketingCollectionRailItem"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface MarketingCollectionsHomeViewSectionProps {
  section: MarketingCollectionsHomeViewSection_section$key
}

export const MarketingCollectionsHomeViewSection: React.FC<
  MarketingCollectionsHomeViewSectionProps
> = ({ section }) => {
  const tracking = useTracking()

  const data = useFragment(fragment, section)
  const component = data.component
  const componentHref = component?.behaviors?.viewAll?.href

  if (!component) return null

  const marketingCollections = extractNodes(data.marketingCollectionsConnection)
  if (!marketingCollections || marketingCollections.length === 0) return null

  return (
    <Flex>
      <Flex pl={2} pr={2}>
        <SectionTitle
          title={component.title}
          onPress={
            componentHref
              ? () => {
                  navigate(componentHref)
                }
              : undefined
          }
        />
      </Flex>

      <CardRailFlatList<
        ExtractNodeType<
          MarketingCollectionsHomeViewSection_section$data["marketingCollectionsConnection"]
        >
      >
        data={marketingCollections}
        initialNumToRender={3}
        renderItem={({ item, index }) => {
          return (
            <MarketingCollectionRailItem
              key={item.internalID}
              marketingCollection={item}
              onPress={(marketCollection) => {
                const tapEvent = LegacyHomeAnalytics.collectionThumbnailTapEvent(
                  marketCollection.slug,
                  index,
                  data.internalID as ContextModule
                )
                if (tapEvent) {
                  tracking.trackEvent(tapEvent)
                }
              }}
            />
          )
        }}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment MarketingCollectionsHomeViewSection_section on MarketingCollectionsHomeViewSection {
    internalID
    component {
      title
      behaviors {
        viewAll {
          href
        }
      }
    }

    marketingCollectionsConnection(first: 10) {
      edges {
        node {
          internalID
          ...MarketingCollectionItem_marketingCollection
        }
      }
    }
  }
`

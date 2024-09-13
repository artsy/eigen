import { Flex } from "@artsy/palette-mobile"
import {
  HomeViewSectionMarketingCollections_section$data,
  HomeViewSectionMarketingCollections_section$key,
} from "__generated__/HomeViewSectionMarketingCollections_section.graphql"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT } from "app/Scenes/HomeView/HomeView"
import { HomeViewSectionMarketingCollectionsItem } from "app/Scenes/HomeView/Sections/HomeViewSectionMarketingCollectionsItem"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { graphql, useFragment } from "react-relay"

interface HomeViewSectionMarketingCollectionsProps {
  section: HomeViewSectionMarketingCollections_section$key
}

export const HomeViewSectionMarketingCollections: React.FC<
  HomeViewSectionMarketingCollectionsProps
> = ({ section }) => {
  const tracking = useHomeViewTracking()

  const data = useFragment(fragment, section)
  const component = data.component
  const componentHref = component?.behaviors?.viewAll?.href

  if (!component) return null

  const marketingCollections = extractNodes(data.marketingCollectionsConnection)
  if (!marketingCollections || marketingCollections.length === 0) return null

  return (
    <Flex my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>
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
          HomeViewSectionMarketingCollections_section$data["marketingCollectionsConnection"]
        >
      >
        data={marketingCollections}
        initialNumToRender={3}
        renderItem={({ item, index }) => {
          return (
            <HomeViewSectionMarketingCollectionsItem
              key={item.internalID}
              marketingCollection={item}
              onPress={(collection) => {
                tracking.tappedMarketingCollectionGroup(
                  collection.internalID,
                  collection.slug,
                  data.internalID,
                  index
                )
              }}
            />
          )
        }}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment HomeViewSectionMarketingCollections_section on HomeViewSectionMarketingCollections {
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
          ...HomeViewSectionMarketingCollectionsItem_marketingCollection
        }
      }
    }
  }
`

import { ContextModule } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { FairsRailHomeViewSection_section$key } from "__generated__/FairsRailHomeViewSection_section.graphql"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import LegacyHomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { FairRailItem } from "app/Scenes/HomeView/Sections/FairRailItem"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface FairsRailHomeViewSectionProps {
  section: FairsRailHomeViewSection_section$key
}

export const FairsRailHomeViewSection: React.FC<FairsRailHomeViewSectionProps> = ({ section }) => {
  const tracking = useTracking()

  const data = useFragment(fragment, section)
  const component = data.component
  const componentHref = component?.behaviors?.viewAll?.href

  if (!component) return null

  const fairs = extractNodes(data.fairsConnection)
  if (!fairs || fairs.length === 0) return null

  return (
    <Flex>
      <Flex pl={2} pr={2}>
        <SectionTitle
          title={component.title}
          subtitle={component.description}
          onPress={
            componentHref
              ? () => {
                  navigate(componentHref)
                }
              : undefined
          }
        />
      </Flex>

      <CardRailFlatList<any>
        data={fairs}
        initialNumToRender={3}
        renderItem={({ item, index }) => {
          return (
            <FairRailItem
              key={item.internalID}
              fair={item}
              onPress={(fair) => {
                tracking.trackEvent(
                  LegacyHomeAnalytics.fairThumbnailTapEvent(
                    fair.internalID,
                    fair.slug,
                    index,
                    data.internalID as ContextModule
                  )
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
  fragment FairsRailHomeViewSection_section on FairsRailHomeViewSection {
    internalID
    component {
      title
      description
      behaviors {
        viewAll {
          href
        }
      }
    }

    fairsConnection(first: 10) {
      edges {
        node {
          internalID
          ...FairRailItem_fair
        }
      }
    }
  }
`

import { Flex } from "@artsy/palette-mobile"
import { FeaturedFairsRailHomeViewSection_section$key } from "__generated__/FeaturedFairsRailHomeViewSection_section.graphql"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { FeaturedFairRailItem } from "app/Scenes/HomeView/Sections/FeaturedFairRailItem"
import { extractNodes } from "app/utils/extractNodes"
import { graphql, useFragment } from "react-relay"

interface FeaturedFairsRailHomeViewSectionProps {
  section: FeaturedFairsRailHomeViewSection_section$key
}

export const FeaturedFairsRailHomeViewSection: React.FC<FeaturedFairsRailHomeViewSectionProps> = ({
  section,
}) => {
  const data = useFragment(fragment, section)
  const component = data.component

  if (!component) return null

  const fairs = extractNodes(data.fairsConnection)
  if (!fairs || fairs.length === 0) return null

  return (
    <Flex>
      <Flex pl={2} pr={2}>
        <SectionTitle title={component.title} subtitle={component.description} />
      </Flex>

      <CardRailFlatList<any>
        data={fairs}
        initialNumToRender={3}
        renderItem={({ item }) => {
          return <FeaturedFairRailItem key={item.internalID} fair={item} />
        }}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment FeaturedFairsRailHomeViewSection_section on FeaturedFairsHomeViewSection {
    component {
      title
      description
    }

    fairsConnection(first: 10) {
      edges {
        node {
          internalID
          ...FeaturedFairRailItem_fair
        }
      }
    }
  }
`

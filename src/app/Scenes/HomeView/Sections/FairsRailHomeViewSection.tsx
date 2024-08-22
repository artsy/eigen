import { Flex } from "@artsy/palette-mobile"
import { FairsRailHomeViewSection_section$key } from "__generated__/FairsRailHomeViewSection_section.graphql"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { FairRailItem } from "app/Scenes/HomeView/Sections/FairRailItem"
import { extractNodes } from "app/utils/extractNodes"
import { graphql, useFragment } from "react-relay"

interface FairsRailHomeViewSectionProps {
  section: FairsRailHomeViewSection_section$key
}

export const FairsRailHomeViewSection: React.FC<FairsRailHomeViewSectionProps> = ({ section }) => {
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
          return <FairRailItem key={item.internalID} fair={item} />
        }}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment FairsRailHomeViewSection_section on FairsRailHomeViewSection {
    component {
      title
      description
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

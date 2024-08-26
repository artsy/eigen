import { Flex } from "@artsy/palette-mobile"
import { ViewingRoomsRailHomeViewSection_section$key } from "__generated__/ViewingRoomsRailHomeViewSection_section.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import {
  ViewingRoomsHomeRail as LegacyViewingRoomsHomeRail,
  ViewingRoomsRailPlaceholder,
} from "app/Scenes/ViewingRoom/Components/ViewingRoomsHomeRail"
import { Suspense } from "react"
import { graphql, useFragment } from "react-relay"

export const ViewingRoomsRailHomeViewSection: React.FC<{
  section: ViewingRoomsRailHomeViewSection_section$key
}> = ({ section }) => {
  const data = useFragment(viewingRoomsFragment, section)

  return (
    <Flex>
      <Flex px={2}>
        <SectionTitle title={data.component?.title} />
      </Flex>
      <Suspense fallback={<ViewingRoomsRailPlaceholder />}>
        <LegacyViewingRoomsHomeRail />
      </Suspense>
    </Flex>
  )
}

const viewingRoomsFragment = graphql`
  fragment ViewingRoomsRailHomeViewSection_section on ViewingRoomsRailHomeViewSection {
    component {
      title
    }
  }
`

import { Flex } from "@artsy/palette-mobile"
import { ViewingRoomsRailHomeViewSection_section$key } from "__generated__/ViewingRoomsRailHomeViewSection_section.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import {
  ViewingRoomsHomeRail as LegacyViewingRoomsHomeRail,
  ViewingRoomsRailPlaceholder,
} from "app/Scenes/ViewingRoom/Components/ViewingRoomsHomeRail"
import { navigate } from "app/system/navigation/navigate"
import { Suspense } from "react"
import { graphql, useFragment } from "react-relay"

export const ViewingRoomsRailHomeViewSection: React.FC<{
  section: ViewingRoomsRailHomeViewSection_section$key
}> = ({ section }) => {
  const data = useFragment(viewingRoomsFragment, section)
  const componentHref = data.component?.behaviors?.viewAll?.href

  return (
    <Flex>
      <Flex px={2}>
        <SectionTitle
          title={data.component?.title}
          onPress={
            componentHref
              ? () => {
                  navigate(componentHref)
                }
              : undefined
          }
        />
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
      behaviors {
        viewAll {
          href
        }
      }
    }
  }
`

import { Screen, Text } from "@artsy/palette-mobile"
import { HomeViewSectionScreenFairs_section$key } from "__generated__/HomeViewSectionScreenFairs_section.graphql"
import { HomeViewSectionScreenQuery } from "__generated__/HomeViewSectionScreenQuery.graphql"
import {
  HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT,
  HORIZONTAL_FLATLIST_WINDOW_SIZE,
} from "app/Scenes/HomeView/helpers/constants"
import { HomeViewSectionFairsFairItem } from "app/Scenes/HomeView/Sections/HomeViewSectionFairsFairItem"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { pluralize } from "app/utils/pluralize"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { FlatList } from "react-native"
import { graphql, usePaginationFragment } from "react-relay"

interface FairsScreenHomeSection {
  section: HomeViewSectionScreenFairs_section$key
}

export const HomeViewSectionScreenFairs: React.FC<FairsScreenHomeSection> = (props) => {
  const { data: section, refetch } = usePaginationFragment<
    HomeViewSectionScreenQuery,
    HomeViewSectionScreenFairs_section$key
  >(fairsFragment, props.section)

  const fairs = extractNodes(section?.fairsConnection)

  const RefreshControl = useRefreshControl(refetch)

  return (
    <>
      <Screen.AnimatedHeader onBack={goBack} title={section.component?.title || ""} />

      <Screen.StickySubHeader
        title={section.component?.title || ""}
        Component={
          <Text variant="xs" mt={1}>
            {section.fairsConnection?.totalCount} {pluralize("Fair", fairs.length)}
          </Text>
        }
      />

      <Screen.Body fullwidth>
        <FlatList
          // TODO: Implement pagination
          data={fairs}
          initialNumToRender={HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT}
          renderItem={({ item }) => {
            return (
              <HomeViewSectionFairsFairItem
                key={item.internalID}
                fair={item}
                onPress={() => {
                  // TODO: Add tracking
                }}
              />
            )
          }}
          refreshControl={RefreshControl}
          windowSize={HORIZONTAL_FLATLIST_WINDOW_SIZE}
        />
      </Screen.Body>
    </>
  )
}

export const fairsFragment = graphql`
  fragment HomeViewSectionScreenFairs_section on HomeViewSectionFairs
  @refetchable(queryName: "FairsScreenHomeSection_viewerRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
    internalID
    component {
      title
    }
    ownerType
    fairsConnection(after: $cursor, first: $count)
      @connection(key: "FairsScreenHomeSection_fairsConnection", filters: []) {
      totalCount
      edges {
        node {
          href
          internalID
          slug
          ...HomeViewSectionFairsFairItem_fair
        }
      }
    }
  }
`

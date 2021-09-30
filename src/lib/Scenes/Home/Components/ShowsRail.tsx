import { ShowsRail_showsConnection } from "__generated__/ShowsRail_showsConnection.graphql"
import { SectionTitle } from "lib/Components/SectionTitle"
import { ShowCardContainer } from "lib/Components/ShowCard"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex, Spacer } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer } from "react-relay"
import { useTracking } from "react-tracking"
import { graphql } from "relay-hooks"
import HomeAnalytics from "../homeAnalytics"

interface ShowsRailProps {
  showsConnection: ShowsRail_showsConnection
}

export const ShowsRail: React.FC<ShowsRailProps> = ({ showsConnection }) => {
  const shows = extractNodes(showsConnection)

  if (!shows.length) {
    return null
  }

  const tracking = useTracking()

  return (
    <Flex>
      <Flex mx={2}>
        <SectionTitle
          title="Shows for You"
          onPress={() => {
            tracking.trackEvent(HomeAnalytics.articlesHeaderTapEvent())
            navigate("/shows")
          }}
        />
      </Flex>
      <Flex>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={() => <Spacer ml="2" />}
          ListFooterComponent={() => <Spacer ml="2" />}
          ItemSeparatorComponent={() => <Spacer ml="2" />}
          data={shows}
          keyExtractor={(item) => `${item.internalID}`}
          renderItem={({ item, index }) => (
            <ShowCardContainer
              onPress={() => {
                const tapEvent = HomeAnalytics.articleThumbnailTapEvent(item.internalID, item.slug || "", index)
                tracking.trackEvent(tapEvent)
              }}
              show={item}
            />
          )}
        />
      </Flex>
    </Flex>
  )
}

export const ShowsRailFragmentContainer = createFragmentContainer(ShowsRail, {
  showsConnection: graphql`
    fragment ShowsRail_showsConnection on ShowConnection {
      edges {
        node {
          internalID
          slug
          ...ShowCard_show
        }
      }
    }
  `,
})

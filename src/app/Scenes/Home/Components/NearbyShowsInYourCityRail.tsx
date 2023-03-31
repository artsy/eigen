import { Flex, Spacer } from "@artsy/palette-mobile"
import { NearbyShowsInYourCityRail_showsConnection$key } from "__generated__/NearbyShowsInYourCityRail_showsConnection.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { ShowCardContainer } from "app/Components/ShowCard"
import { extractNodes } from "app/utils/extractNodes"
import { FlatList } from "react-native"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface NearbyShowsInYourCityRailProps {
  showsConnection: NearbyShowsInYourCityRail_showsConnection$key
  title: string
}

export const NearbyShowsInYourCityRail: React.FC<NearbyShowsInYourCityRailProps> = ({
  showsConnection,
  title,
}) => {
  const { showsConnection: showsNodes } = useFragment(
    nearbyShowsInYourCityFragment,
    showsConnection
  )

  const shows = extractNodes(showsNodes)

  if (!shows.length) {
    return null
  }

  return (
    <Flex>
      <Flex mx={2}>
        <SectionTitle title={title} />
      </Flex>
      <Flex>
        <FlatList
          horizontal
          initialNumToRender={2}
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={() => <Spacer x={2} />}
          ListFooterComponent={() => <Spacer x={2} />}
          ItemSeparatorComponent={() => <Spacer x={2} />}
          data={shows}
          keyExtractor={(item) => `${item.internalID}`}
          renderItem={({ item }) => <ShowCardContainer show={item} />}
        />
      </Flex>
    </Flex>
  )
}

const nearbyShowsInYourCityFragment = graphql`
  fragment NearbyShowsInYourCityRail_showsConnection on City {
    showsConnection(first: 10, status: CURRENT) {
      edges {
        node {
          internalID
          slug
          ...ShowCard_show
        }
      }
    }
  }
`

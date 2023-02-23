import { Spacer, Text } from "@artsy/palette-mobile"
import { PartnerArtistsList_partner$key } from "__generated__/PartnerArtistsList_partner.graphql"
import { PartnerOverview_partner$data } from "__generated__/PartnerOverview_partner.graphql"
import { ArtistListItemContainer as ArtistListItem } from "app/Components/ArtistListItem"
import { extractNodes } from "app/utils/extractNodes"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"

interface PartnerArtistsListProps {
  partner: PartnerOverview_partner$data
}

export const PartnerArtistsList: React.FC<PartnerArtistsListProps> = ({ partner }) => {
  const { allArtistsConnection } = useFragment<PartnerArtistsList_partner$key>(
    PartnerArtistsListFragment,
    partner
  )

  const artists = extractNodes(allArtistsConnection)

  const hasArtists = artists.length > 0

  if (!hasArtists) {
    return null
  }

  return (
    <>
      <Text variant="sm-display">Artists ({allArtistsConnection?.totalCount})</Text>
      <Spacer y={2} />
      <FlatList
        accessibilityRole="list"
        accessibilityLabel="Partner artists list"
        data={artists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ArtistListItem artist={item} />}
        ItemSeparatorComponent={() => <Spacer y={2} />}
        initialNumToRender={15}
      />
      <Spacer y={4} />
    </>
  )
}

const PartnerArtistsListFragment = graphql`
  fragment PartnerArtistsList_partner on Partner {
    allArtistsConnection(
      displayOnPartnerProfile: true
      hasNotRepresentedArtistWithPublishedArtworks: true
    ) {
      totalCount
      edges {
        node {
          id
          ...ArtistListItem_artist
        }
      }
    }
  }
`

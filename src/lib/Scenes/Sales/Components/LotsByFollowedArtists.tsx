import { LotsByFollowedArtists_me } from "__generated__/LotsByFollowedArtists_me.graphql"
import { ArtworkTileRail } from "lib/Components/ArtworkTileRail"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { Box } from "palette"
import React from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

interface LotsByFollowedArtistsProps {
  title?: string
  me: LotsByFollowedArtists_me
  relay: RelayPaginationProp
}

export const LotsByFollowedArtists: React.FC<LotsByFollowedArtistsProps> = ({
  me,
  title = "Lots by Artists You Follow",
}) => {
  if (!me.lotsByFollowedArtistsConnection?.edges?.length) {
    return null
  }

  return (
    <Box>
      <Box px={2}>
        <SectionTitle title={title} onPress={() => navigate("/lots-by-artists-you-follow")} />
      </Box>

      <ArtworkTileRail artworksConnection={me.lotsByFollowedArtistsConnection} />
    </Box>
  )
}

export default createPaginationContainer(
  LotsByFollowedArtists,
  {
    me: graphql`
      fragment LotsByFollowedArtists_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        lotsByFollowedArtistsConnection(first: $count, after: $cursor, liveSale: true, isAuction: true)
          @connection(key: "LotsByFollowedArtists_lotsByFollowedArtistsConnection") {
          edges {
            cursor
          }
          ...ArtworkTileRail_artworksConnection
        }
      }
    `,
  },
  {
    getConnectionFromProps: ({ me }) => me && me.lotsByFollowedArtistsConnection,
    getVariables: (_props, { count, cursor }) => ({ count, cursor }),
    query: graphql`
      query LotsByFollowedArtistsQuery($count: Int!, $cursor: String) {
        me {
          ...LotsByFollowedArtists_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

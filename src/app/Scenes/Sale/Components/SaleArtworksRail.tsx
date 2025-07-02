import { OwnerType } from "@artsy/cohesion"
import { SaleArtworksRail_me$key } from "__generated__/SaleArtworksRail_me.graphql"
import { CardRailFlatList } from "app/Components/CardRail/CardRailFlatList"
import { SaleArtworkTileRailCardContainer } from "app/Components/SaleArtworkTileRailCard"
import { SectionTitle } from "app/Components/SectionTitle"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { createFragmentContainer, graphql, useFragment } from "react-relay"

interface Props {
  me: SaleArtworksRail_me$key
}

export const INITIAL_NUMBER_TO_RENDER = 4

export const SaleArtworksRail: React.FC<Props> = ({ me }) => {
  const data = useFragment(fragment, me)
  const artworks = extractNodes(data?.lotsByFollowedArtistsConnection)

  if (!artworks?.length) {
    return null
  }

  return (
    <>
      <SectionTitle title="Lots by artists you follow" mx={2} />
      <CardRailFlatList
        data={artworks}
        initialNumToRender={INITIAL_NUMBER_TO_RENDER}
        windowSize={3}
        renderItem={({ item: artwork }) => (
          <SaleArtworkTileRailCardContainer
            onPress={() => {
              navigate(artwork.href)
            }}
            saleArtwork={artwork.saleArtwork}
            useSquareAspectRatio
            useCustomSaleMessage
            contextScreenOwnerType={OwnerType.sale}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </>
  )
}

const fragment = graphql`
  fragment SaleArtworksRail_me on Me @argumentDefinitions(saleID: { type: "ID" }) {
    lotsByFollowedArtistsConnection(
      first: 10
      includeArtworksByFollowedArtists: true
      saleID: $saleID
    ) {
      edges {
        node {
          id
          href @required(action: NONE)
          saleArtwork {
            ...SaleArtworkTileRailCard_saleArtwork
          }
        }
      }
    }
  }
`

export const SaleArtworksRailContainer = createFragmentContainer(SaleArtworksRail, {
  me: fragment,
})

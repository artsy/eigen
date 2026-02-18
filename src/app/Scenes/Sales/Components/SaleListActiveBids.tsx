import { ContextModule } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { ArtworkRail_artworks$key } from "__generated__/ArtworkRail_artworks.graphql"
import { SaleListActiveBids_me$key } from "__generated__/SaleListActiveBids_me.graphql"
import { ArtworkRail } from "app/Components/ArtworkRail/ArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { graphql, useFragment } from "react-relay"

interface Props {
  me: SaleListActiveBids_me$key | null | undefined
}

export const SaleListActiveBids: React.FC<Props> = (props) => {
  const me = useFragment(meFragment, props.me)

  const artworks = me?.lotStandings
    ?.map((lotStanding) => lotStanding?.saleArtwork?.artwork)
    .filter((artwork) => !!artwork)

  if (!artworks?.length) {
    return null
  }

  return (
    <Flex>
      <SectionTitle mx={2} title="Your Active Bids" />

      <ArtworkRail
        contextModule={ContextModule.yourActiveBids}
        artworks={artworks as ArtworkRail_artworks$key}
        onPress={({ href }) => {
          if (href) {
            navigate(href)
          }
        }}
      />
    </Flex>
  )
}

const meFragment = graphql`
  fragment SaleListActiveBids_me on Me {
    lotStandings(live: true) {
      saleArtwork {
        artwork {
          ...ArtworkRail_artworks
        }
      }
    }
  }
`

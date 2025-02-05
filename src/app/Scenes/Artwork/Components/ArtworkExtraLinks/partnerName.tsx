import { ArtworkExtraLinks_artwork$data } from "__generated__/ArtworkExtraLinks_artwork.graphql"
import { ArtworkLotDetails_artwork$data } from "__generated__/ArtworkLotDetails_artwork.graphql"
import { ConfirmBid_saleArtwork$data } from "__generated__/ConfirmBid_saleArtwork.graphql"

type SaleWithPartner = Pick<
  NonNullable<
    | ConfirmBid_saleArtwork$data["sale"]
    | ArtworkExtraLinks_artwork$data["sale"]
    | ArtworkLotDetails_artwork$data["sale"]
  >,
  "partner" | "isBenefit"
>

export const partnerName = ({ isBenefit, partner }: SaleWithPartner) => {
  if (isBenefit || !partner?.name) {
    return "Artsy's"
  } else {
    const name = partner.name

    if (name.endsWith("'s") || name.endsWith("’s")) {
      return `Artsy's and ${name}`
    } else if (name.endsWith("'") || name.endsWith("’")) {
      return `Artsy's and ${name}s`
    } else {
      return `Artsy's and ${name}'s`
    }
  }
}

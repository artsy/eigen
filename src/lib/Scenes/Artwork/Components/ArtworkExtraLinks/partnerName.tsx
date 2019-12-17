import { ArtworkExtraLinks_artwork } from "__generated__/ArtworkExtraLinks_artwork.graphql"
import { ConfirmBid_sale_artwork } from "__generated__/ConfirmBid_sale_artwork.graphql"
import { isEmpty } from "lodash"

type SaleWithPartner = ConfirmBid_sale_artwork["sale"] | ArtworkExtraLinks_artwork["sale"]

export const partnerName = ({ isBenefit, partner }: SaleWithPartner) => {
  if (isBenefit || isEmpty(partner)) {
    return "Artsy's"
  } else {
    const { name } = partner

    if (name.endsWith("'s") || name.endsWith("’s")) {
      return `Artsy's and ${name}`
    } else if (name.endsWith("'") || name.endsWith("’")) {
      return `Artsy's and ${name}s`
    } else {
      return `Artsy's and ${name}'s`
    }
  }
}

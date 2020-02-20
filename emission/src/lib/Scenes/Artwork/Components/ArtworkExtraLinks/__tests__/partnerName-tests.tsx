import { ArtworkExtraLinks_artwork } from "__generated__/ArtworkExtraLinks_artwork.graphql"
import { partnerName } from "../partnerName"

describe("partnerName", () => {
  const sale = { isBenefit: false, partner: null } as ArtworkExtraLinks_artwork["sale"]

  it(`returns "Artsy's" if the sale is a benefit auction`, () => {
    expect(partnerName({ ...sale, isBenefit: true })).toEqual("Artsy's")
  })

  it(`returns "Artsy's" if the partner is empty`, () => {
    expect(partnerName({ ...sale, partner: null })).toEqual("Artsy's")
  })

  it(`adds a "Artsy's" prefix and "'s" to the end of the partner name`, () => {
    expect(partnerName({ ...sale, partner: { name: "Digard" } })).toEqual("Artsy's and Digard's")
  })

  it(`adds a "Artsy's" prefix and "s" to the end of the partner name if the partner name ends with "'" (normal single quote)`, () => {
    expect(partnerName({ ...sale, partner: { name: "GALERIE K'" } })).toEqual("Artsy's and GALERIE K's")
  })

  it(`adds a "Artsy's" prefix and "s" to the end of the partner name if the partner name ends with "’" (smart quote)`, () => {
    expect(partnerName({ ...sale, partner: { name: "GALERIE K’" } })).toEqual("Artsy's and GALERIE K’s")
  })

  it(`only adds a "Artsy's" prefix if the partner name ends with a "'s" (normal single quote)`, () => {
    expect(partnerName({ ...sale, partner: { name: "Christie's" } })).toEqual("Artsy's and Christie's")
  })

  it(`only adds a "Artsy's" prefix if the partner name ends with a "’s" (smart quote) `, () => {
    expect(partnerName({ ...sale, partner: { name: "Christie’s" } })).toEqual("Artsy's and Christie’s")
  })

  it(`adds a "Artsy's" prefix and "'" (single quote) to the end of the partner name if the partner name ends with "s"`, () => {
    expect(partnerName({ ...sale, partner: { name: "Phillips" } })).toEqual("Artsy's and Phillips's")
  })
})

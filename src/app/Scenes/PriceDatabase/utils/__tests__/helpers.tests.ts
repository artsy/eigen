import { paramsToCamelCase, paramsToSnakeCase } from "app/Scenes/PriceDatabase/utils/helpers"

describe(paramsToSnakeCase, () => {
  it("converts camel cased filter arguments to snake case", () => {
    const params = {
      partnerID: "gagosian-gallery",
      forSale: true,
      atAuction: true,
      inquireableOnly: false,
      artistIDs: ["catty-gallery", "doggy-gallery"],
    }
    expect(paramsToSnakeCase(params)).toEqual({
      partner_id: "gagosian-gallery",
      for_sale: true,
      at_auction: true,
      inquireable_only: false,
      artist_ids: ["catty-gallery", "doggy-gallery"],
    })
  })
})

describe(paramsToCamelCase, () => {
  it("converts snake cased filter arguments to camel case", () => {
    const params = {
      partner_id: "gagosian-gallery",
      for_sale: true,
      at_auction: true,
      inquireable_only: false,
      artist_ids: ["catty-gallery", "doggy-gallery"],
    }
    expect(paramsToCamelCase(params)).toEqual({
      partnerID: "gagosian-gallery",
      forSale: true,
      atAuction: true,
      inquireableOnly: false,
      artistIDs: ["catty-gallery", "doggy-gallery"],
    })
  })
})

import Interstellar
@testable
import Artsy

func stub_auctionSale() -> LiveSale {
    let stateFetcher = Stubbed_StaticDataFetcher()
    return stateFetcher.fetchStaticData().peekValue()!.sale
}

func stub_auctionSalesPerson() -> LiveAuctionsSalesPersonType {
    let sale = stub_auctionSale()
    return LiveAuctionsSalesPerson(sale: sale, jwt: "abcdefg", stateManagerCreator: LiveAuctionsSalesPerson.stubbedStateManagerCreator())
}

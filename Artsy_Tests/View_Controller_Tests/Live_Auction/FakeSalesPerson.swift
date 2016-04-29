import Interstellar
@testable
import Artsy

func stub_auctionSalesPerson() -> LiveAuctionsSalesPersonType {
    let stateFetcher = Stubbed_StaticDataFetcher()
    let sale = stateFetcher.fetchStaticData().peekValue()!
    return LiveAuctionsSalesPerson(sale: sale, accessToken: "abcdefg", stateManagerCreator: LiveAuctionsSalesPerson.stubbedStateManagerCreator())
}

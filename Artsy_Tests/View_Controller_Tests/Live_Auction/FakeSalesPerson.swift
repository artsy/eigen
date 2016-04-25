import Interstellar
@testable
import Artsy

func stub_auctionSalesPerson() -> LiveAuctionsSalesPersonType {
    return LiveAuctionsSalesPerson(saleID: "saleID", accessToken: "abcdefg", stateManagerCreator: LiveAuctionsSalesPerson.stubbedStateManagerCreator())
}

import Interstellar
@testable
import Artsy
import Interstellar

func stub_auctionSalesPerson() -> LiveAuctionsSalesPersonType {
    return LiveAuctionsSalesPerson(saleID: "saleID", accessToken: "abcdefg", stateManagerCreator: LiveAuctionsSalesPerson.stubbedStateManagerCreator())
}

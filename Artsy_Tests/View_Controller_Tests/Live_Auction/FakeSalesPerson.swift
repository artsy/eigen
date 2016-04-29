import Interstellar
@testable
import Artsy

func stub_auctionSalesPerson() -> LiveAuctionsSalesPersonType {
    let start = NSDate(timeInterval: -3600, sinceDate: NSDate())
    let end = NSDate(timeInterval: 3600, sinceDate: NSDate())
    return LiveAuctionsSalesPerson(sale: testLiveSaleWithStart(start, end: end), accessToken: "abcdefg", stateManagerCreator: LiveAuctionsSalesPerson.stubbedStateManagerCreator())
}

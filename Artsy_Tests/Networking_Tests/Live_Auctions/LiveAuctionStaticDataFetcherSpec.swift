import Quick
import Nimble
import OHHTTPStubs
@testable
import Artsy

class LiveAuctionStaticDataFetcherSpec: QuickSpec {
    override func spec() {

        let saleID = "the-id"
        let stateJSON: NSDictionary = ["data": ["sale": ["id": "the-id"]]]

        var subject: LiveAuctionStaticDataFetcher!

        beforeEach {
            OHHTTPStubs.stubJSONResponseForHost("metaphysics-*.artsy.net", withResponse: stateJSON)
            subject = LiveAuctionStaticDataFetcher(saleSlugOrID: saleID)
        }
        
        it("configures its sale ID correctly") {
            expect(subject.saleSlugOrID) == saleID
        }

        it("fetches the static data") {
            let receivedState = subject.fetchStaticData()

            expect(receivedState.peekValue()?.liveSaleID) == saleID
        }
    }
}

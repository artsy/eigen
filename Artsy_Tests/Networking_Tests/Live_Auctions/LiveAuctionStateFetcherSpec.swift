import Quick
import Nimble
import OHHTTPStubs
@testable
import Artsy

class LiveAuctionStateFetcherSpec: QuickSpec {
    override func spec() {

        let saleID = "sale_id"
        let host = "http://sillyhost"
        let saleJSON: NSDictionary = ["id": saleID]

        var subject: LiveAuctionStateFetcher!

        beforeEach {
            OHHTTPStubs.stubJSONResponseAtPath("", withResponse: saleJSON)

            subject = LiveAuctionStateFetcher(host: host, saleID: saleID)
        }
        
        it("configures its sale ID correctly") {
            expect(subject.saleID) == saleID
        }

        it("configures its host correctly") {
            expect(subject.host) == host
        }

        it("fetches the sale state") {
            var receivedState: AnyObject?

            subject
                .fetchSale()
                .next { state in
                    receivedState = state
            }

            let dictionary = receivedState as? NSDictionary
            expect((dictionary ?? [:])["id"] as? String) == saleID
        }
    }
}

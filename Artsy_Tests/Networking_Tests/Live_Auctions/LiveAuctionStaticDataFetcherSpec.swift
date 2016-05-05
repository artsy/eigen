import Quick
import Nimble
import OHHTTPStubs
@testable
import Artsy

class LiveAuctionStaticDataFetcherSpec: QuickSpec {
    override func spec() {

        let saleID = "the-id"
        let jwt = "random-byyyyyytes"
        let stateJSON: NSDictionary = ["data": ["sale": ["id": "the-id"], "causality_jwt": jwt]]

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

            expect(receivedState.peekValue()?.sale.liveSaleID) == saleID
        }

        it("fetches a kwt") {
            let receivedState = subject.fetchStaticData()

            expect(receivedState.peekValue()?.jwt) == jwt
        }
    }
}

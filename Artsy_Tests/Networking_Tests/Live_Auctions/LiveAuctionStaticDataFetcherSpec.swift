import Quick
import Nimble
import OHHTTPStubs
import Interstellar
@testable
import Artsy

class LiveAuctionStaticDataFetcherSpec: QuickSpec {
    override func spec() {

        let saleID = "the-id"
        let jwt = "random-byyyyyytes"
        let bidderID = "000000"
        let stateJSON: NSDictionary = ["data": ["sale": ["id": "the-id"], "causality_jwt": jwt, "me": ["paddle_number": bidderID]]]

        var subject: LiveAuctionStaticDataFetcher!

        beforeEach {
            OHHTTPStubs.stubJSONResponseForHost("metaphysics*.artsy.net", withResponse: stateJSON)
            subject = LiveAuctionStaticDataFetcher(saleSlugOrID: saleID)
        }

        it("configures its sale ID correctly") {
            expect(subject.saleSlugOrID) == saleID
        }

        describe("after fetching") {
            var receivedState: Observable<StaticSaleResult>!

            beforeEach {
                receivedState = subject.fetchStaticData()
            }

            it("fetches the static data") {
                expect(receivedState.peekValue()?.sale.liveSaleID) == saleID
            }

            it("fetches a jwt") {
                expect(receivedState.peekValue()?.jwt) == jwt
            }

            it("fetches a bidderId") {
                expect(receivedState.peekValue()?.bidderID) == bidderID
            }
        }
    }
}

import Quick
import Nimble
import OHHTTPStubs
import Interstellar
@testable
import Artsy

class LiveAuctionStaticDataFetcherSpec: QuickSpec {
    override func spec() {

        let saleID = "the-id"

        let jwt = StubbedCredentials.NotRegistered.jwt.string
        let bidderID = "000000"
        let paddleNumber = "1234"
        let stateJSON: NSDictionary = ["data": ["sale": ["id": "the-id"], "causality_jwt": jwt, "me": ["paddle_number": paddleNumber, "bidders": [["id": bidderID]]]]]

        var subject: LiveAuctionStaticDataFetcher!

        beforeEach {
            OHHTTPStubs.stubJSONResponse(forHost: "metaphysics*.artsy.net", withResponse: stateJSON)
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
                expect(receivedState.peekValue()?.jwt.string) == jwt
            }

            it("fetches a bidderId") {
                expect(receivedState.peekValue()?.bidderCredentials.bidderID) == bidderID
            }

            it("fetches a paddleNumber") {
                expect(receivedState.peekValue()?.bidderCredentials.paddleNumber) == paddleNumber
            }

        }
    }
}

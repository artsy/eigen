import Quick
import Nimble
import Interstellar

@testable
import Artsy

class LiveAuctionStaticDataFetcherSpec: QuickSpec {
    override func spec() {

        let saleID = "the-id"

        let jwt = StubbedCredentials.notRegistered.jwt.string
        let bidderID = "000000"
        let paddleNumber = "1234"
        let userID = "abcd"
        let stateJSON: NSDictionary = ["data": ["sale": ["id": "the-id"], "system": ["causalityJWT": jwt], "me": ["id": userID, "paddle_number": paddleNumber, "bidders": [["id": bidderID]]]]]

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
                expect(receivedState.peek()?.sale.liveSaleID) == saleID
            }

            it("fetches a jwt") {
                expect(receivedState.peek()?.jwt.string) == jwt
            }

            it("fetches a bidderId") {
                expect(receivedState.peek()?.bidderCredentials.bidderID) == bidderID
            }

            it("fetches a paddleNumber") {
                expect(receivedState.peek()?.bidderCredentials.paddleNumber) == paddleNumber
            }

        }
    }
}

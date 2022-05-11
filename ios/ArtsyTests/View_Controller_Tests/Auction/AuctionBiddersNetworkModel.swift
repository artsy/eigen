import Quick
import Nimble
import Nimble_Snapshots
import Foundation
import Interstellar
@testable
import Artsy


class AuctionBiddersNetworkModelSpec: QuickSpec {
    override func spec() {
        let bidderJSON: NSArray = [["id": "bidder", "sale": ["id": "sale"]]]

        afterEach {
            ARUserManager.clearUserData()
        }

        it("returns registered when bidders endpoint returns >=1 bidders") {
            ARUserManager.stubAndSetupUser()
            OHHTTPStubs.stubJSONResponse(atPath: "/api/v1/me/bidders", withResponse: bidderJSON)

            let subject = AuctionBiddersNetworkModel()

            var bidders: [Bidder]?
            waitUntil { done in
                subject.fetchBiddersForSale("whatever").subscribe { result in
                    if case .success(let r) = result {
                        bidders = r
                    }
                    done()
                }
            }

            expect(bidders).to(haveCount(1))
        }


        it("returns an empty bidders array in when user is not logged in") {
            let subject = AuctionBiddersNetworkModel()

            var receivedBidders: [Bidder]?
            waitUntil { done in
                subject.fetchBiddersForSale("whatever").subscribe { result in
                    if case .success(let r) = result {
                        receivedBidders = r
                    }
                    done()
                }
            }

            expect(receivedBidders).to( beEmpty() )
        }



        it("caches the fetched result") {
            ARUserManager.stubAndSetupUser()
            OHHTTPStubs.stubJSONResponse(atPath: "/api/v1/me/bidders", withResponse: bidderJSON)

            let subject = AuctionBiddersNetworkModel()

            waitUntil { done in
                subject.fetchBiddersForSale("whatever").subscribe { result in
                    done()
                }
            }

            expect(subject.bidders).to( haveCount(1) )
        }
    }
}

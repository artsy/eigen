import Quick
import Nimble
import Nimble_Snapshots
import Foundation
import Interstellar
import OHHTTPStubs
@testable
import Artsy

class AuctionRegistrationStatusNetworkModelSpec: QuickSpec {
    override func spec() {
        let bidderJSON: NSArray = [["id": "bidder", "sale": ["id": "sale"]]]

        afterEach {
            ARUserManager.clearUserData()
        }

        it("returns registered when bidders endpoint returns >=1 bidders") {
            ARUserManager.stubAndLoginWithUsername()
            OHHTTPStubs.stubJSONResponseAtPath("/api/v1/me/bidders", withResponse: bidderJSON)

            let subject = AuctionRegistrationStatusNetworkModel()

            var registrationStatus: ArtsyAPISaleRegistrationStatus?
            waitUntil { done in
                subject.fetchBiddersForSale("whatever").subscribe { result in
                    if case .Success(let r) = result {
                        registrationStatus = r
                    }
                    done()
                }
            }

            expect(registrationStatus) == .Registered
        }

        it("returns not registered when bidders endpoint returns zero bidders") {
            ARUserManager.stubAndLoginWithUsername()
            OHHTTPStubs.stubJSONResponseAtPath("/api/v1/me/bidders", withResponse: [])

            let subject = AuctionRegistrationStatusNetworkModel()

            var registrationStatus: ArtsyAPISaleRegistrationStatus?
            waitUntil { done in
                subject.fetchBiddersForSale("whatever").subscribe { result in
                    if case .Success(let r) = result {
                        registrationStatus = r
                    }
                    done()
                }
            }

            expect(registrationStatus) == .NotRegistered
        }

        it("returns not logged in when user is not logged in") {
            let subject = AuctionRegistrationStatusNetworkModel()

            var registrationStatus: ArtsyAPISaleRegistrationStatus?
            waitUntil { done in
                subject.fetchBiddersForSale("whatever").subscribe { result in
                    if case .Success(let r) = result {
                        registrationStatus = r
                    }
                    done()
                }
            }

            expect(registrationStatus) == .NotLoggedIn
        }



        it("caches the fetched result") {
            ARUserManager.stubAndLoginWithUsername()
            OHHTTPStubs.stubJSONResponseAtPath("/api/v1/me/bidders", withResponse: bidderJSON)

            let subject = AuctionRegistrationStatusNetworkModel()

            waitUntil { done in
                subject.fetchRegistrationStatus("whatever").subscribe { result in
                    done()
                }
            }

            expect(subject.fetchBiddersForSale) == .Registered
        }
    }
}

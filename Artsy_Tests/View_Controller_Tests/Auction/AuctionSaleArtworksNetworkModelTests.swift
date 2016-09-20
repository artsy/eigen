import Quick
import Nimble
import Nimble_Snapshots
import Foundation
import Interstellar
import OHHTTPStubs
@testable
import Artsy

class AuctionSaleArtworksNetworkModelSpec: QuickSpec {
    override func spec() {
        let saleArtworkID = "sale_artwork_id"
        let saleArtworksJSON: NSArray = [["id": saleArtworkID]]
        let saleID = "the-fun-sale"

        var subject: AuctionSaleArtworksNetworkModel!

        beforeEach {
            subject = AuctionSaleArtworksNetworkModel()
        }

        it("returns fetches the sale artworks") {
            OHHTTPStubs.stubJSONResponseAtPath("/api/v1/sale/\(saleID)/sale_artworks", withResponse: saleArtworksJSON)

            var saleArtworks: [SaleArtwork]?
            waitUntil { done in
                subject.fetchSaleArtworks(saleID).subscribe { result in
                    if case .Success(let a) = result { saleArtworks = a }
                    done()
                }
            }

            expect(saleArtworks?.first?.saleArtworkID) == saleArtworkID
        }

        it("caches the fetched sale artworks") {
            OHHTTPStubs.stubJSONResponseAtPath("/api/v1/sale/\(saleID)/sale_artworks", withResponse: saleArtworksJSON)

            waitUntil { done in
                subject.fetchSaleArtworks(saleID).subscribe { result in
                    done()
                }
            }

            expect(subject.saleArtworks?.first?.saleArtworkID) == saleArtworkID
        }

        it("loads the second page, if necessary") {
            var callNumber = 0
            OHHTTPStubs.stubRequestsPassingTest({ request in
                    return request.URL?.path?.containsString("/api/v1/sale/\(saleID)/sale_artworks") ?? false
                },
                withStubResponse: { _ in
                    defer { callNumber += 1 }

                    // Returns 100 sale artworks the first invocation, then returns none subsequently.
                    if callNumber == 0 {
                        let allPages: NSArray = Array(0..<100).map { _ -> NSDictionary in
                            return ["id": saleArtworkID]
                        }

                        return OHHTTPStubsResponse(JSONObject: allPages, statusCode: 200, headers: nil)
                    } else {
                        return OHHTTPStubsResponse(JSONObject: saleArtworksJSON, statusCode: 200, headers: nil)
                    }
                })


            waitUntil { done in
                subject.fetchSaleArtworks(saleID).subscribe { _ in
                    done()
                }
            }

            expect(callNumber) == 2
        }
    }
}

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
        let saleArtworksJSON: NSArray = [[
            "id": saleArtworkID,
            "artwork": [
                "id": "some-artwork-id",
                "published": true
            ]
            ]]
        let saleID = "the-fun-sale"

        var subject: AuctionSaleArtworksNetworkModel!

        beforeEach {
            subject = AuctionSaleArtworksNetworkModel()
        }

        it("returns fetches the sale artworks") {
            OHHTTPStubs.stubJSONResponse(atPath: "/api/v1/sale/\(saleID)/sale_artworks", withResponse: saleArtworksJSON)

            var saleArtworks: [SaleArtwork]?
            waitUntil { done in
                subject.fetchSaleArtworks(saleID).subscribe { result in
                    if case .success(let a) = result { saleArtworks = a }
                    done()
                }
            }

            expect(saleArtworks?.first?.saleArtworkID) == saleArtworkID
        }

        it("loads the second page, if necessary") {
            var callNumber = 0
            OHHTTPStubs.stubRequests(passingTest: { request in
                    return request?.url?.path.contains("/api/v1/sale/\(saleID)/sale_artworks") ?? false
                },
                withStubResponse: { _ in
                    defer { callNumber += 1 }

                    // Returns 100 sale artworks the first invocation, then returns none subsequently.
                    if callNumber == 0 {
                        let allPages = Array(0..<100).map { _ -> NSDictionary in
                            return ["id": saleArtworkID]
                        } as NSArray

                        return OHHTTPStubsResponse(jsonObject: allPages, statusCode: 200, headers: nil)
                    } else {
                        return OHHTTPStubsResponse(jsonObject: saleArtworksJSON, statusCode: 200, headers: nil)
                    }
                })


            waitUntil { done in
                subject.fetchSaleArtworks(saleID).subscribe { _ in
                    done()
                }
            }

            expect(callNumber) == 2
        }
        
        it("filters out lots with unpublished artworks") {
            let saleArtworksJSON: NSArray = [[
                "id": saleArtworkID,
                "artwork": [
                    "id": "some-artwork-id",
                    "published": false
                ]
            ]]
            OHHTTPStubs.stubJSONResponse(atPath: "/api/v1/sale/\(saleID)/sale_artworks", withResponse: saleArtworksJSON)
            
            var saleArtworks: [SaleArtwork]?
            waitUntil { done in
                subject.fetchSaleArtworks(saleID).subscribe { result in
                    if case .success(let a) = result { saleArtworks = a }
                    done()
                }
            }
            
            expect(saleArtworks).to( beEmpty() )
        }
    }
}

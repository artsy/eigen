import Quick
import Nimble
import Interstellar
import OHHTTPStubs
@testable
import Artsy

class AuctionLotStandingsNetworkModelSpec: QuickSpec {
    override func spec() {
        let saleArtworkID = "sale_artwork_id"
        let saleArtworksJSON: NSArray = [["id": saleArtworkID]]
        let saleID = "the-fun-sale"

        var subject: AuctionLotStandingsNetworkModel!

        beforeEach {
            subject = AuctionLotStandingsNetworkModel()
        }

        it("returns fetches the sale artworks") {
            OHHTTPStubs.stubJSONResponse(atPath: "/api/v1/me/lot_standings", withResponse: saleArtworksJSON)

            var lotStandings: [LotStanding]?
            waitUntil { done in
                subject.fetch(saleID).subscribe { result in
                    if case .success(let a) = result { lotStandings = a }
                    done()
                }
            }

            expect(lotStandings).toNot( beEmpty() )
        }


        it("stores the sale artworks after fetching") {
            OHHTTPStubs.stubJSONResponse(atPath: "/api/v1/me/lot_standings", withResponse: saleArtworksJSON)

            waitUntil { done in
                subject.fetch(saleID).subscribe { _ in
                    done()
                }
            }

            expect(subject.lotStandings).toNot( beEmpty() )
        }
    }
}

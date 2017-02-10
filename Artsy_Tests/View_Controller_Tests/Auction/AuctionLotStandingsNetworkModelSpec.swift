import Quick
import Nimble
import Interstellar
import OHHTTPStubs
@testable
import Artsy

class AuctionLotStandingsNetworkModelSpec: QuickSpec {
    override func spec() {
        let saleArtworksJSON: NSArray = [[
            "sale_artwork": [ "id": "some-sale-artwork-id" ],
            "leading_position": nil
        ]]
        let saleID = "the-fun-sale"

        var subject: AuctionLotStandingsNetworkModel!

        beforeEach {
            OHHTTPStubs.stubJSONResponse(atPath: "/api/v1/me/lot_standings", withResponse: saleArtworksJSON)

            subject = AuctionLotStandingsNetworkModel()
        }

        it("returns fetches the sale artworks") {
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
            waitUntil { done in
                subject.fetch(saleID).subscribe { _ in
                    done()
                }
            }

            expect(subject.lotStandings).toNot( beEmpty() )
        }
    }
}

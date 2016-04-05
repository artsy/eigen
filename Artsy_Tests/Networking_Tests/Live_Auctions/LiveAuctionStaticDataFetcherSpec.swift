import Quick
import Nimble
import OHHTTPStubs
@testable
import Artsy

class LiveAuctionStaticDataFetcherSpec: QuickSpec {
    override func spec() {

        let saleID = "sale_id"
        let stateJSON = loadJSON("live_static_data")

        var subject: LiveAuctionStaticDataFetcher!

        beforeEach {
            OHHTTPStubs.stubJSONResponseAtPath("", withResponse: stateJSON)

            subject = LiveAuctionStaticDataFetcher(saleID: saleID)
        }
        
        it("configures its sale ID correctly") {
            expect(subject.saleID) == saleID
        }

        it("fetches the static data") {
            var receivedSaleArtworks: [SaleArtwork]?

            subject
                .fetchStaticData()
                .next { saleArtworks in
                    receivedSaleArtworks = saleArtworks
            }

            expect(receivedSaleArtworks?.count) == 10
        }
    }
}

import Quick
import Nimble
import Nimble_Snapshots
import Foundation
import Interstellar
import OHHTTPStubs
@testable
import Artsy

class AuctionSaleNetworkModelSpec: QuickSpec {
    override func spec() {
        let saleID = "sale_id"
        let saleJSON: NSDictionary = ["id": saleID]

        it("returns fetches the sale") {
            OHHTTPStubs.stubJSONResponseAtPath("/api/v1/sale/\(saleID)", withResponse: saleJSON)

            let subject = AuctionSaleNetworkModel()

            var sale: Sale?
            waitUntil { done in
                subject.fetchSale(saleID).subscribe { result in
                    if case .Success(let s) = result { sale = s }
                    done()
                }
            }

            expect(sale?.saleID) == saleID
        }

        it("caches the fetched sale") {
            OHHTTPStubs.stubJSONResponseAtPath("/api/v1/sale/\(saleID)", withResponse: saleJSON)

            let subject = AuctionSaleNetworkModel()

            waitUntil { done in
                subject.fetchSale(saleID).subscribe { result in
                    done()
                }
            }

            expect(subject.sale?.saleID) == saleID
        }

    }
}

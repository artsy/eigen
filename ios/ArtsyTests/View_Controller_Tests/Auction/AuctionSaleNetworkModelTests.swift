import Quick
import Nimble
import Nimble_Snapshots
import Foundation
import Interstellar

@testable
import Artsy

class AuctionSaleNetworkModelSpec: QuickSpec {
    override func spec() {
        let saleID = "sale_id"
        let saleJSON: NSDictionary = ["id": saleID]

        it("returns fetches the sale") {
            OHHTTPStubs.stubJSONResponse(atPath: "/api/v1/sale/\(saleID)", withResponse: saleJSON)

            let subject = AuctionSaleNetworkModel()

            var sale: Sale?
            waitUntil(timeout: .seconds(10)) { done in
                subject.fetchSale(saleID).subscribe { result in
                    if case .success(let s) = result { sale = s }
                    done()
                }
            }

            expect(sale?.saleID) == saleID
        }

        it("caches the fetched sale") {
            OHHTTPStubs.stubJSONResponse(atPath: "/api/v1/sale/\(saleID)", withResponse: saleJSON)

            let subject = AuctionSaleNetworkModel()

            waitUntil(timeout: .seconds(10)) { done in
                subject.fetchSale(saleID).subscribe { result in
                    done()
                }
            }

            expect(subject.sale?.saleID) == saleID
        }

    }
}

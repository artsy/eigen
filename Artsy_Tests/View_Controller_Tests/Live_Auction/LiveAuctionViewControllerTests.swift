import Quick
import Nimble
import Nimble_Snapshots
import Interstellar
import UIKit

@testable
import Artsy

class LiveAuctionLotSetViewControllerTests: QuickSpec {
    override func spec() {
        it("looks good by default") {
            let fakeSalesPerson = stub_auctionSalesPerson()
            let subject = LiveAuctionLotSetViewController(saleID: "sale-id", salesPerson: fakeSalesPerson)

            expect(subject).to( haveValidSnapshot() )
        }
    }
}

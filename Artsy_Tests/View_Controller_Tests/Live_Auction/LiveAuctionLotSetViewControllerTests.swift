import Quick
import Nimble
import Nimble_Snapshots
import Interstellar
import UIKit

@testable
import Artsy

class LiveAuctionLotSetViewControllerSpec: QuickSpec {
    override func spec() {
        pending("looks good by default") {
            let fakeSalesPerson = stub_auctionSalesPerson()
            let subject = LiveAuctionLotSetViewController(salesPerson: fakeSalesPerson)

            expect(subject) == snapshot()
        }
    }
}

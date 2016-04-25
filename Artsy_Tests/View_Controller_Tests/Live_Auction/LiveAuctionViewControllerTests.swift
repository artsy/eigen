import Quick
import Nimble
import Nimble_Snapshots
import Interstellar
import UIKit

@testable
import Artsy

class LiveAuctionViewControllerTests: QuickSpec {
    override func spec() {
        it("looks good by default") {

            let subject = LiveAuctionViewController(saleID: "sale-id")
            let fake = stub_auctionSalesPerson()
            subject.salesPerson = fake

            expect(subject).to( haveValidSnapshot() )
        }
    }
}

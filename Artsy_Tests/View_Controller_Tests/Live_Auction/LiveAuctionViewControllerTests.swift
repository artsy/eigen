import Quick
import Nimble
import Nimble_Snapshots
import Interstellar
import UIKit

@testable
import Artsy

class LiveAuctionViewControllerTests: QuickSpec {
    override func spec() {
        pending("looks good by default") {

            let subject = LiveAuctionViewController(saleID: "sale-id")
            let fake = stub_auctionSalesPerson()
            subject.salesPerson = fake
            subject.loadViewProgrammatically()

            expect(subject).to( haveValidSnapshot() )
        }
    }
}

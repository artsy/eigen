import Quick
import Nimble
import Nimble_Snapshots
import UIKit

@testable
import Artsy

class LiveAuctionLotListViewControllerTests: QuickSpec {
    override func spec() {

        it("looks good by default") {
            let fake = stub_auctionSalesPerson()
            let subject = LiveAuctionLotListViewController(salesPerson: fake, currentLotSignal: fake.currentLotSignal, auctionViewModel: fake.auctionViewModel)

            expect(subject) == snapshot()
        }

        it("shows the selected lot") {
            let fake = stub_auctionSalesPerson()
            let subject = LiveAuctionLotListViewController(salesPerson: fake, currentLotSignal: fake.currentLotSignal, auctionViewModel: fake.auctionViewModel)
            subject.selectedIndex = 4
            expect(subject) == snapshot()
        }
    }
}

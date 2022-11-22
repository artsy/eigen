import Quick
import Nimble
import Nimble_Snapshots
import UIKit

@testable
import Artsy

// TODO: These tests are crashing after Xcode 14 update
// Seems to have to do with device stubbing
// LiveAuctionLotListViewControllerTests
// LiveAuctionLotSetViewControllerSpec
// LiveAuctionViewControllerTests


//class LiveAuctionLotListViewControllerTests: QuickSpec {
//    override func spec() {
//
//        it("live auction lot list looks good by default") {
//            let fake = stub_auctionSalesPerson()
//            let subject = LiveAuctionLotListViewController(salesPerson: fake, currentLotSignal: fake.currentLotSignal, auctionViewModel: fake.auctionViewModel)
//
//            expect(subject) == snapshot()
//        }
//
//        it("live auction lot list shows the selected lot") {
//            let fake = stub_auctionSalesPerson()
//            let subject = LiveAuctionLotListViewController(salesPerson: fake, currentLotSignal: fake.currentLotSignal, auctionViewModel: fake.auctionViewModel)
//            subject.selectedIndex = 4
//            expect(subject) == snapshot()
//        }
//    }
//}

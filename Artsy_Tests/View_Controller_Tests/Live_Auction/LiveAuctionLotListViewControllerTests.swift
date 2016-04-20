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
            let subject = LiveAuctionLotListViewController(lots: fake.lots, currentLotSignal: fake.currentLotSignal, auctionViewModel: fake.auctionViewModel!)

            for lot in fake.lots {
                cacheColoredImageForURL(lot.urlForThumbnail)
            }

            expect(subject) == snapshot()
        }

    }
}

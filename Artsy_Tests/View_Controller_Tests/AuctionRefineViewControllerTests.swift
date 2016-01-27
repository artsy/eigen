import Quick
import Nimble
import Nimble_Snapshots
import UIKit
@testable
import Artsy

class AuctionRefineViewControllerSpec: QuickSpec {
    override func spec() {
        it("looks good by default") {
            let subject = AuctionRefineViewController()

            expect(subject).to( haveValidSnapshot() )
        }

        it("looks good when configured with options") {
            let subject = AuctionRefineViewController()
            subject.initialSettings = AuctionRefineSettings(ordering: AuctionOrderingSwitchValue.ArtistAlphabetical)

            expect(subject).to( haveValidSnapshot() )
        }
    }
}
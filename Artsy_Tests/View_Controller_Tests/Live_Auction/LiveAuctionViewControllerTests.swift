import Quick
import Nimble
import Nimble_Snapshots
import UIKit

@testable
import Artsy

class LiveAuctionViewControllerTests: QuickSpec {
    override func spec() {
        it("looks good by default") {
            let subject = LiveAuctionViewController()
            expect(subject).to( haveValidSnapshot() )
        }
    }
}

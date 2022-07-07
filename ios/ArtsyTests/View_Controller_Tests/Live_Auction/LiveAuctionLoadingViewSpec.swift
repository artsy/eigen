import Quick
import Nimble
import Nimble_Snapshots
@testable
import Artsy

class LiveAuctionLoadingViewSpec: QuickSpec {
    override func spec() {
        it("looks good by default") {
            let subject = LiveAuctionLoadingView(frame: CGRect(x: 0, y: 0, width: 600, height: 800))
            expect(subject) == snapshot()
        }
    }
}

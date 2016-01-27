import Quick
import Nimble
import Nimble_Snapshots
import UIKit
@testable
import Artsy

class AuctionRefineViewControllerSpec: QuickSpec {
    override func spec() {
        let defaultSettings = AuctionRefineSettings(ordering: .LotNumber, range: (min: 100, max: 100_000))
        let differentSettings = AuctionRefineSettings(ordering: .ArtistAlphabetical, range: (min: 100, max: 50_000))

        it("looks good by default") {
            let subject = AuctionRefineViewController(defaultSettings: defaultSettings, initialSettings: defaultSettings)

            expect(subject).to( haveValidSnapshot() )
        }

        it("looks good when configured with options and changed options") {
            let subject = AuctionRefineViewController(defaultSettings: defaultSettings, initialSettings: differentSettings)
            
            expect(subject).to( haveValidSnapshot() )
        }
    }
}
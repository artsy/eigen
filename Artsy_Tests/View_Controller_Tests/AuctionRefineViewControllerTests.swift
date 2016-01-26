import Quick
import Nimble
import Nimble_Snapshots
import UIKit
@testable
import Artsy

class AuctionRefineViewControllerSpec: QuickSpec {
    override func spec() {
        let defaultSettings = AuctionRefineSettings(ordering: .LotNumber)
        let differentSettings = AuctionRefineSettings(ordering: .ArtistAlphabetical)

        it("looks good by default") {
            let subject = AuctionRefineViewController(defaultSettings: defaultSettings, initialSettings: defaultSettings)

            expect(subject).to( haveValidSnapshot() )
        }

        it("looks good when configured with options") {
            let subject = AuctionRefineViewController(defaultSettings: defaultSettings, initialSettings: differentSettings)

            expect(subject).to( haveValidSnapshot() )
        }

        it("looks good when configured with options and changed options") {
            let subject = AuctionRefineViewController(defaultSettings: defaultSettings, initialSettings: defaultSettings)
            
            subject.loadViewProgrammatically()
            subject.currentSettings = differentSettings

            expect(subject).to( haveValidSnapshot() )
        }
    }
}
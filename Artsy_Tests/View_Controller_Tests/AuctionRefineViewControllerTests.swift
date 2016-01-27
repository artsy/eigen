import Quick
import Nimble
import Nimble_Snapshots
import UIKit
@testable
import Artsy
import MARKRangeSlider

class AuctionRefineViewControllerSpec: QuickSpec {
    override func spec() {
        let defaultSettings = AuctionRefineSettings(ordering: .LotNumber, range: (min: 100, max: 100_000))
        let differentSettings = AuctionRefineSettings(ordering: .ArtistAlphabetical, range: (min: 100, max: 50_000))

        it("looks good by default") {
            let subject = AuctionRefineViewController(defaultSettings: defaultSettings, initialSettings: defaultSettings)

            expect(subject).to( haveValidSnapshot() )
        }

        it("enables apply/reset buttons when options are changed") {
            let subject = AuctionRefineViewController(defaultSettings: defaultSettings, initialSettings: defaultSettings)
            subject.loadViewProgrammatically()

            // Simulate a change to the settings
            let slider = subject.findSlider()
            slider?.setLeftValue(CGFloat(differentSettings.range.min), rightValue: CGFloat(differentSettings.range.max))
            slider?.sendActionsForControlEvents(.ValueChanged)

            expect(subject).to( haveValidSnapshot() )
        }

        it("looks good when configured with options and changed options") {
            let subject = AuctionRefineViewController(defaultSettings: defaultSettings, initialSettings: differentSettings)

            expect(subject).to( haveValidSnapshot() )
        }

        it("looks good when reset") {
            let subject = AuctionRefineViewController(defaultSettings: defaultSettings, initialSettings: differentSettings)
            subject.loadViewProgrammatically()

            subject.userDidPressReset()

            expect(subject).to( haveValidSnapshot() )
        }
    }
}

extension UIViewController {
    func findSlider() -> MARKRangeSlider? {
        return findViewOfClass(view, type: MARKRangeSlider.self) as? MARKRangeSlider
    }

    private func findViewOfClass(view: UIView, type: AnyClass) -> UIView? {
        let lookup = view.subviews.filter { $0.isKindOfClass(type) }.first

        if lookup != nil { return lookup }

        return view.subviews.flatMap { findViewOfClass($0, type: type) }.first
    }
}

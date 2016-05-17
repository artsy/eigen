import Quick
import Nimble
import Nimble_Snapshots
import UIKit
@testable
import Artsy
import MARKRangeSlider

class RefinementOptionsViewControllerSpec: QuickSpec {
    override func spec() {
        let openSale = try! Sale(dictionary: ["saleID": "the-tada-sale", "name": "Sotheby’s Boundless Contemporary", "saleDescription": description, "startDate": NSDate.distantPast(), "endDate": NSDate.distantFuture() ], error: Void())

        let openSaleViewModel = SaleViewModel(sale: openSale, saleArtworks: [])

        let defaultSettings = AuctionRefineSettings(ordering: .LotNumber, priceRange: (min: 500_00, max: 100_000_00), saleViewModel: openSaleViewModel)
        let differentSettings = AuctionRefineSettings(ordering: .ArtistAlphabetical, priceRange: (min: 500_00, max: 50_000_00), saleViewModel: openSaleViewModel)
        let settingsWithNoEstimates = AuctionRefineSettings(ordering: .ArtistAlphabetical, priceRange: (min: 0, max: 0), saleViewModel: openSaleViewModel)

        it("looks good by default") {
            let subject = RefinementOptionsViewController(defaultSettings: defaultSettings, initialSettings: defaultSettings, currencySymbol: "$", userDidCancelClosure: nil, userDidApplyClosure: nil)

            expect(subject).to( haveValidSnapshot() )
        }

        it("looks good by when there are no estimates") {
            let subject = RefinementOptionsViewController(defaultSettings: defaultSettings, initialSettings: settingsWithNoEstimates, currencySymbol: "$", userDidCancelClosure: nil, userDidApplyClosure: nil)
            expect(subject).to( haveValidSnapshot() )
        }

        it("enables apply/reset buttons when options are changed") {
            let subject = RefinementOptionsViewController(defaultSettings: defaultSettings, initialSettings: defaultSettings, currencySymbol: "$", userDidCancelClosure: nil, userDidApplyClosure: nil)

            subject.loadViewProgrammatically()

            // Simulate a change to the settings
            let slider = subject.findSlider()
            slider?.setLeftValue(CGFloat(differentSettings.priceRange!.min), rightValue: CGFloat(differentSettings.priceRange!.max))
            slider?.sendActionsForControlEvents(.ValueChanged)

            expect(subject).to( haveValidSnapshot() )
        }

        it("looks good when configured with options and changed options") {
            let subject = RefinementOptionsViewController(defaultSettings: defaultSettings, initialSettings: differentSettings, currencySymbol: "$", userDidCancelClosure: nil, userDidApplyClosure: nil)

            expect(subject).to( haveValidSnapshot() )
        }

        it("looks good when reset") {
            let subject = RefinementOptionsViewController(defaultSettings: defaultSettings, initialSettings: differentSettings, currencySymbol: "$", userDidCancelClosure: nil, userDidApplyClosure: nil)

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
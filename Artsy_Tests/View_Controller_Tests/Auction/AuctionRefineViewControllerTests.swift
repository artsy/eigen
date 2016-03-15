import Quick
import Nimble
import Nimble_Snapshots
import UIKit
@testable
import Artsy
import MARKRangeSlider

class AuctionRefineViewControllerSpec: QuickSpec {
    override func spec() {
        let defaultSettings = AuctionRefineSettings(ordering: .LotNumber, range: (min: 500_00, max: 100_000_00))
        let differentSettings = AuctionRefineSettings(ordering: .ArtistAlphabetical, range: (min: 500_00, max: 50_000_00))
        let settingsWithNoEstimates = AuctionRefineSettings(ordering: .ArtistAlphabetical, range: (min: 0, max: 0))

        let openSale = try! Sale(dictionary: ["saleID": "the-tada-sale", "name": "Sotheby’s Boundless Contemporary", "saleDescription": description, "startDate": NSDate.distantPast(), "endDate": NSDate.distantFuture() ], error: Void())

        let openSaleViewModel = SaleViewModel(sale: openSale, saleArtworks: [])


        let closedSale = try! Sale(dictionary: ["saleID": "the-tada-sale", "name": "Sotheby’s Boundless Contemporary", "saleDescription": description, "startDate": NSDate.distantFuture(), "endDate": NSDate.distantFuture() ], error: Void())
        let closeSaleViewModel = SaleViewModel(sale: closedSale, saleArtworks: [])

        it("looks good by default") {
            let subject = AuctionRefineViewController(defaultSettings: defaultSettings, initialSettings: defaultSettings)
            subject.saleViewModel = openSaleViewModel

            expect(subject).to( haveValidSnapshot() )
        }

        it("looks good by when there are no estimates") {
            let subject = AuctionRefineViewController(defaultSettings: defaultSettings, initialSettings: settingsWithNoEstimates)
            subject.saleViewModel = openSaleViewModel
            expect(subject).to( haveValidSnapshot() )
        }

        it("doesnt show the bid sorting options for closed sales") {
            let subject = AuctionRefineViewController(defaultSettings: defaultSettings, initialSettings: defaultSettings)
            subject.saleViewModel = closeSaleViewModel

            expect(subject).to( haveValidSnapshot() )
        }


        it("enables apply/reset buttons when options are changed") {
            let subject = AuctionRefineViewController(defaultSettings: defaultSettings, initialSettings: defaultSettings)
            subject.saleViewModel = openSaleViewModel

            subject.loadViewProgrammatically()

            // Simulate a change to the settings
            let slider = subject.findSlider()
            slider?.setLeftValue(CGFloat(differentSettings.range.min), rightValue: CGFloat(differentSettings.range.max))
            slider?.sendActionsForControlEvents(.ValueChanged)

            expect(subject).to( haveValidSnapshot() )
        }

        it("looks good when configured with options and changed options") {
            let subject = AuctionRefineViewController(defaultSettings: defaultSettings, initialSettings: differentSettings)
            subject.saleViewModel = openSaleViewModel


            expect(subject).to( haveValidSnapshot() )
        }

        it("looks good when reset") {
            let subject = AuctionRefineViewController(defaultSettings: defaultSettings, initialSettings: differentSettings)
            subject.saleViewModel = openSaleViewModel

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

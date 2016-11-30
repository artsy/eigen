import Quick
import Nimble
import Nimble_Snapshots
import UIKit
@testable
import Artsy
import MARKRangeSlider

class RefinementOptionsViewControllerSpec: QuickSpec {
    override func spec() {
        let openSale = try! Sale(dictionary: ["saleID": "the-tada-sale", "name": "Sotheby’s Boundless Contemporary", "saleDescription": description, "startDate": Date.distantPast, "endDate": Date.distantFuture ], error: Void())

        let openSaleViewModel = SaleViewModel(sale: openSale, saleArtworks: [], bidders: [])

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
            slider?.sendActions(for: .valueChanged)

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

        func jsonForStub(_ name: String) -> [String: AnyObject] {
            let url = Bundle(for: RefineGeneSettingsTests.self).url(forResource: name, withExtension: "json")
            let data = try? Data(contentsOf: url!)
            return try! JSONSerialization.jsonObject(with: data!, options: []) as! [String: AnyObject]
        }


        it("looks good with gene refine settings") {
            let json = jsonForStub("gene_refine_example_full")

            guard let geneSettings = GeneRefineSettings.refinementFromAggregationJSON(json) else { return fail() }

            let subject = RefinementOptionsViewController(defaultSettings: geneSettings, initialSettings: geneSettings, currencySymbol: "$", userDidCancelClosure: nil, userDidApplyClosure: nil)

            subject.loadViewProgrammatically()
            expect(subject).to( haveValidSnapshot() )
        }

        it("looks good with gene refine settings with no price") {
            let json = jsonForStub("gene_refine_example_short_medium")

            guard let geneSettings = GeneRefineSettings.refinementFromAggregationJSON(json) else { return fail() }

            let subject = RefinementOptionsViewController(defaultSettings: geneSettings, initialSettings: geneSettings, currencySymbol: "$", userDidCancelClosure: nil, userDidApplyClosure: nil)

            subject.loadViewProgrammatically()
            expect(subject).to( haveValidSnapshot() )
        }


        it("looks good with gene refine settings showing price") {
            let json = jsonForStub("gene_refine_example_medium_price")

            guard let geneSettings = GeneRefineSettings.refinementFromAggregationJSON(json) else { return fail() }

            let subject = RefinementOptionsViewController(defaultSettings: geneSettings, initialSettings: geneSettings, currencySymbol: "$", userDidCancelClosure: nil, userDidApplyClosure: nil)

            subject.loadViewProgrammatically()
            expect(subject).to( haveValidSnapshot() )
        }

    }
}

extension UIViewController {
    func findSlider() -> MARKRangeSlider? {
        return findViewOfClass(view, type: MARKRangeSlider.self) as? MARKRangeSlider
    }

    fileprivate func findViewOfClass(_ view: UIView, type: AnyClass) -> UIView? {
        let lookup = view.subviews.filter { $0.isKind(of: type) }.first

        if lookup != nil { return lookup }

        return view.subviews.flatMap { findViewOfClass($0, type: type) }.first
    }
}

import Quick
import Nimble
import Nimble_Snapshots
import UIKit
import OHHTTPStubs

@testable
import Artsy

class AuctionInformationViewControllerSpec: QuickSpec {
    override func spec() {

        let past = ARStandardDateFormatter.shared().date(from: "2016-02-18T10:00:00+00:00")!
        let past2 = ARStandardDateFormatter.shared().date(from: "2016-02-19T10:00:00+00:00")!
        let future = ARStandardDateFormatter.shared().date(from: "2025-02-18T23:59:00+00:00")!
        let description = "On Thursday, November 12, Swiss Institute will host their Annual Benefit Dinner & Auction–the most important fundraising event of the year–with proceeds going directly towards supporting their innovative exhibitions and programs. Since 1986, Swiss Institute has been dedicated to promoting forward-thinking and experimental art."


        var sale: Sale! = try! Sale(dictionary: ["saleID": "the-tada-sale", "name": "Sotheby’s Boundless Contemporary", "saleDescription": description, "startDate": past, "endDate": future ], error: Void())
        var saleViewModel: SaleViewModel! = SaleViewModel(sale: sale, saleArtworks: [], bidders: [], lotStandings: [])

        let markdown = "# Other Requests\n## Can you tell me the worth of my artwork?\n\nArtsy does not provide appraisal or authentication services for individual sellers. We recommend reaching out to professional dealers, galleries, and auction houses for assistance.\n\nFor any further questions, please contact [support@artsy.net](mailto:support@artsy.net)."

        var navigationController: ARSerifNavigationViewController!
        var informationController: AuctionInformationViewController!

        // Ensure there is a key window for all of the tests
        var window: UIWindow?
        beforeSuite {
            window = UIWindow()
            window?.makeKeyAndVisible()
        }

        func commonSetup() {
            informationController = AuctionInformationViewController(saleViewModel: saleViewModel)
            navigationController = ARSerifNavigationViewController(rootViewController: informationController)

            for entry in informationController.FAQEntries {
                OHHTTPStubs.stubJSONResponse(atPath: "/api/v1/page/\(entry.slug)", withResponse:["published":true, "content": markdown])
            }
        }

        context("a current sale") {
            beforeEach {
                sale = try! Sale(dictionary: ["saleID": "the-tada-sale", "name": "Sotheby’s Boundless Contemporary", "saleDescription": description, "startDate": past, "endDate": future ], error: Void())
                saleViewModel = SaleViewModel(sale: sale, saleArtworks: [], bidders: [], lotStandings: [])
                commonSetup()
            }

            ["iPhone": ARDeviceType.phone6.rawValue, "iPad": ARDeviceType.pad.rawValue].forEach { (deviceName, deviceType) in
                it("has a root view that shows information about the auction and looks good on \(deviceName)") {
                    ARTestContext.use(ARDeviceType(rawValue: deviceType)!) {
                        expect(navigationController).to( haveValidSnapshot(usesDrawRect: true) )
                    }
                }
            }

            it("shows a button for buyer's premium when needed") {
                let sale = try! Sale(dictionary: ["saleID": "the-tada-sale", "name": "Sotheby’s Boundless Contemporary", "saleDescription": description, "startDate": past, "endDate": future, "buyersPremium" : [] ], error: Void())
                let saleViewModel = SaleViewModel(sale: sale, saleArtworks: [], bidders: [], lotStandings: [])
                informationController = AuctionInformationViewController(saleViewModel: saleViewModel)
                navigationController = ARSerifNavigationViewController(rootViewController: informationController)
                for entry in informationController.FAQEntries {
                    OHHTTPStubs.stubJSONResponse(atPath: "/api/v1/page/\(entry.slug)", withResponse:["published":true, "content": markdown])
                }

                expect(navigationController).to( haveValidSnapshot(usesDrawRect: true) )
            }

            it("has a FAQ view that answers questions about the auction") {
                let FAQController = informationController.showFAQ(false)
                expect(navigationController).to( haveValidSnapshot(named: "FAQ Initial Entry", usesDrawRect: true) )

                for (index, view) in FAQController.entryViews.enumerated() {
                    view.didTap()
                    let entry = FAQController.entries[index]
                    expect(navigationController).to( haveValidSnapshot(named: "FAQ Entry: \(entry.name)", usesDrawRect: true))
                }
            }
        }

        context("a closed sale") {
            beforeEach {
                sale = try! Sale(dictionary: ["saleID": "the-tada-sale", "name": "Sotheby’s Boundless Contemporary", "saleDescription": description, "startDate": past, "endDate": past2 ], error: Void())
                saleViewModel = SaleViewModel(sale: sale, saleArtworks: [], bidders: [], lotStandings: [])
                commonSetup()
            }

            it("shows the sale is closed") {
                expect(navigationController).to( haveValidSnapshot() )
            }
        }
    }
}

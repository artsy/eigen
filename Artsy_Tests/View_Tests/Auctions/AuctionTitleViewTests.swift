import Quick
import Nimble
import Nimble_Snapshots
import UIKit
import Forgeries
@testable
import Artsy


class AuctionTitleViewSpec: QuickSpec {
    override func spec() {
        let sale = try! Sale(dictionary: ["name": "The 🎉 Sale"], error: Void())
        let viewModel = SaleViewModel(sale: sale, saleArtworks: [])

        sharedExamples("title view") { (context: SharedExampleContext) in
            var horizontalSizeClass: UIUserInterfaceSizeClass!

            beforeEach {
                let rawValue = context()["horizontalSizeClass"] as! Int
                horizontalSizeClass = UIUserInterfaceSizeClass(rawValue: rawValue)
            }

            it("looks good without a registration status") {
                let subject = AuctionTitleView(viewModel: viewModel, registrationStatus: nil, delegate: Test_EmptyAuctionTitleViewDelegate())
                subject.stubHorizontalSizeClass(horizontalSizeClass)
                subject.bounds.size.width = 400

                expect(subject).to( haveValidSnapshot() )
            }

            it("looks good with a logged out registration status") {
                let subject = AuctionTitleView(viewModel: viewModel, registrationStatus: ArtsyAPISaleRegistrationStatusNotLoggedIn, delegate: Test_EmptyAuctionTitleViewDelegate())
                subject.stubHorizontalSizeClass(horizontalSizeClass)
                subject.bounds.size.width = 400

                expect(subject).to( haveValidSnapshot() )
            }

            it("looks good with a not registered registration status") {
                let subject = AuctionTitleView(viewModel: viewModel, registrationStatus: ArtsyAPISaleRegistrationStatusNotRegistered, delegate: Test_EmptyAuctionTitleViewDelegate())
                subject.stubHorizontalSizeClass(horizontalSizeClass)
                subject.bounds.size.width = 400

                expect(subject).to( haveValidSnapshot() )
            }

            it("looks good with a registered registration status") {
                let subject = AuctionTitleView(viewModel: viewModel, registrationStatus: ArtsyAPISaleRegistrationStatusRegistered, delegate: Test_EmptyAuctionTitleViewDelegate())
                subject.stubHorizontalSizeClass(horizontalSizeClass)
                subject.bounds.size.width = 400

                expect(subject).to( haveValidSnapshot() )
            }
        }

        describe("Regular") {
            itBehavesLike("title view") {
                return ["horizontalSizeClass": UIUserInterfaceSizeClass.Regular.rawValue] as NSDictionary
            }
        }

        describe("compact") {
            itBehavesLike("title view") {
                return ["horizontalSizeClass": UIUserInterfaceSizeClass.Compact.rawValue] as NSDictionary
            }

        }
    }
}

class Test_EmptyAuctionTitleViewDelegate: AuctionTitleViewDelegate {
    func userDidPressInfo(titleView: AuctionTitleView) { }
    func userDidPressRegister(titleView: AuctionTitleView) { }
}

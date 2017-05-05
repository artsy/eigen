import Quick
import Nimble
import Nimble_Snapshots
import UIKit
import Forgeries
import FLKAutoLayout
@testable
import Artsy


class AuctionTitleViewSpec: QuickSpec {
    override func spec() {
        let sale = try! Sale(dictionary: ["name": "The 🎉 Sale"], error: Void())
        var viewModel: Test_SaleViewModel!

        let delegate = Test_AuctionTitleViewDelegate()
        var fullWidth: Bool!

        beforeEach {
            viewModel = Test_SaleViewModel(sale: sale, saleArtworks: [], bidders: [qualifiedBidder])
        }

        sharedExamples("title view") { (context: SharedExampleContext) in
            it("looks good without a registration status") {
                let subject = AuctionTitleView(viewModel: viewModel, delegate: delegate, fullWidth: fullWidth, showAdditionalInformation: true, titleTextAlignment: .left)
                subject.bounds.size.width = 400

                expect(subject).to( haveValidSnapshot() )
            }

            it("looks good with a logged out registration status") {
                let subject = AuctionTitleView(viewModel: viewModel, delegate: delegate, fullWidth: fullWidth, showAdditionalInformation: true, titleTextAlignment: .left)
                subject.bounds.size.width = 400

                expect(subject).to( haveValidSnapshot() )
            }

            it("looks good with a not registered registration status") {
                viewModel = Test_SaleViewModel(sale: sale, saleArtworks: [], bidders: [])
                let subject = AuctionTitleView(viewModel: viewModel, delegate: delegate, fullWidth: fullWidth, showAdditionalInformation: true, titleTextAlignment: .left)
                subject.bounds.size.width = 400

                expect(subject).to( haveValidSnapshot() )
            }

            it("looks good with a registered registration status") {
                viewModel.stubbedAuctionState.insert(.userIsRegistered)
                let subject = AuctionTitleView(viewModel: viewModel, delegate: delegate, fullWidth: fullWidth, showAdditionalInformation: true, titleTextAlignment: .left)
                subject.bounds.size.width = 400
                subject.constrainWidth("400")

                expect(subject).to( haveValidSnapshot() )
            }

            it("looks good without a info button") {
                viewModel.stubbedAuctionState.insert(.userIsRegistered)
                let subject = AuctionTitleView(viewModel: viewModel, delegate: delegate, fullWidth: fullWidth, showAdditionalInformation: false, titleTextAlignment: .left)
                subject.bounds.size.width = 400

                expect(subject).to( haveValidSnapshot() )
            }
        }
        describe("with the registration button having side insets") {
            beforeEach {
                fullWidth = false
            }
            itBehavesLike("title view")
        }

        describe("with the registration button spanning the full width") {
            beforeEach {
                fullWidth = true
            }
            itBehavesLike("title view")
        }
    }
}

class Test_AuctionTitleViewDelegate: AuctionTitleViewDelegate {
    @objc func userDidPressInfo(_ titleView: AuctionTitleView) { }
    @objc func userDidPressRegister(_ titleView: AuctionTitleView) { }
}

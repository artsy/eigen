import Quick
import Nimble
import Nimble_Snapshots
import UIKit

@testable
import Artsy


class AuctionTitleViewSpec: QuickSpec {
    override func spec() {
        let sale = try! Sale(dictionary: ["name": "The 🎉 Sale"], error: Void())
        var viewModel: Test_SaleViewModel!

        let delegate = Test_AuctionTitleViewDelegate()
        var fullWidth: Bool!

        beforeEach {
            ARUserManager.stubAndLoginWithUsername()
            viewModel = Test_SaleViewModel(sale: sale, saleArtworks: [], promotedSaleArtworks: [], bidders: [qualifiedBidder], lotStandings: [], me: User())
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
                viewModel = Test_SaleViewModel(sale: sale, saleArtworks: [], promotedSaleArtworks: [], bidders: [], lotStandings: [], me: User())
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

            it("looks good with a sale and user requiring identity verification") {
                let saleDict : [String: Any] = [
                    "name" : "The 🎉 Sale",
                    "requireIdentityVerification": true,
                ]
                let idVerifySale = try! Sale(dictionary: saleDict, error: Void())
                let idVerifyViewModel = Test_SaleViewModel(sale: idVerifySale, saleArtworks: [], promotedSaleArtworks: [], bidders: [], lotStandings: [], me: User())
                let subject = AuctionTitleView(viewModel: idVerifyViewModel, delegate: delegate, fullWidth: fullWidth, showAdditionalInformation: true, titleTextAlignment: .left)
                expect(subject).to( haveValidSnapshot() )
            }

            it("looks good with a sale and user who has already been identity-verified") {
                let me = try! User(dictionary: [
                        "userID": ARUserManager.stubUserID(),
                        "name": ARUserManager.stubUserName(),
                        "email": ARUserManager.stubUserEmail(),
                        "identityVerified": true
                    ], error: Void())
                let saleDict : [String: Any] = [
                    "name" : "The 🎉 Sale",
                    "requireIdentityVerification": true,
                ]
                let idVerifySale = try! Sale(dictionary: saleDict, error: Void())
                let idVerifyViewModel = Test_SaleViewModel(sale: idVerifySale, saleArtworks: [], promotedSaleArtworks: [], bidders: [], lotStandings: [], me: me)
                let subject = AuctionTitleView(viewModel: idVerifyViewModel, delegate: delegate, fullWidth: fullWidth, showAdditionalInformation: true, titleTextAlignment: .left)
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
    @objc func userDidPressIdentityFAQ(_ titleView: AuctionTitleView) { }
    @objc func userDidPressInfo(_ titleView: AuctionTitleView) { }
    @objc func userDidPressRegister(_ titleView: AuctionTitleView) { }
}

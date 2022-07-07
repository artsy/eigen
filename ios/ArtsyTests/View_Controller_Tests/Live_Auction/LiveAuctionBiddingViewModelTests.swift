import Quick
import Nimble
import Interstellar
import UIKit

@testable
import Artsy

class LiveAuctionBiddingViewModelTests: QuickSpec {
    override func spec() {

        var lotViewModel: Test_LiveAuctionLotViewModel!
        var auctionViewModel: Test_LiveAuctionViewModel!

        beforeEach {
            lotViewModel = Test_LiveAuctionLotViewModel()
            auctionViewModel = Test_LiveAuctionViewModel()
        }

        it("unsubscribes from lot state when deallocated") {
            var progressSignalInvocations = 0
            do {
                let subject = LiveAuctionBiddingViewModel(currencySymbol: "$", lotViewModel: lotViewModel, auctionViewModel: auctionViewModel)
                subject.progressSignal.subscribe { _ in
                    progressSignalInvocations += 1
                }
            }

            lotViewModel.lotStateSignal.update(.liveLot)

            expect(progressSignalInvocations) == 1
        }

        it("unsubscribes from asking price when deallocated") {
            var progressSignalInvocations = 0
            do {
                let subject = LiveAuctionBiddingViewModel(currencySymbol: "$", lotViewModel: lotViewModel, auctionViewModel: auctionViewModel)
                subject.progressSignal.subscribe { _ in
                    progressSignalInvocations += 1
                }
            }

            lotViewModel.askingPriceSignal.update(5_500_00)

            expect(progressSignalInvocations) == 1

        }

        it("unsubscribes from current lot when deallocated") {
            var progressSignalInvocations = 0
            do {
                let subject = LiveAuctionBiddingViewModel(currencySymbol: "$", lotViewModel: lotViewModel, auctionViewModel: auctionViewModel)
                subject.progressSignal.subscribe { _ in
                    progressSignalInvocations += 1
                }
            }

            auctionViewModel.currentLotSignal.update(Test_LiveAuctionLotViewModel())

            expect(progressSignalInvocations) == 1
        }
    }
}

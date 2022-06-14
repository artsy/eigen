import Quick
import Nimble
import Nimble_Snapshots
import Interstellar
import Foundation

@testable
import Artsy

class LiveAuctionBidButtonTests: QuickSpec {

    override func spec() {

        let examples: [String: [LiveAuctionBidButtonState]] = [
            "registration required": [.active(biddingState: .userRegistrationRequired)],
            "registration pending": [.active(biddingState: .userRegistrationPending)],
            "registration closed": [.active(biddingState: .userRegistrationClosed)],
            "biddable": [.active(biddingState: .biddable(askingPrice: 45_000_00, currencySymbol: "$"))],
            "in progress": [.active(biddingState: .biddingInProgress )],
            "failed": [.active(biddingState: .bidNetworkFail)],
            // Note: a positive side-effect of this test is that we don't accidentally lowercase currencies
            "waiting on auctioneer confirmation": [.active(biddingState: .bidNotYetAccepted(askingPrice: 23_000_00, currencySymbol: "ETH"))],
            "max bidder": [.active(biddingState: .bidBecameMaxBidder)],
            "not max bidder": [.active(biddingState: .bidBecameMaxBidder), .active(biddingState: .biddable(askingPrice: 1000, currencySymbol: ""))],
            "waiting": [.active(biddingState: .lotWaitingToOpen)],
            "sold": [.active(biddingState: .lotSold)],
            "closed": [.inActive(lotState: .closedLot(wasPassed: false))],
            "passed": [.inActive(lotState: .closedLot(wasPassed: true))],
            "upcoming": [.inActive(lotState: .upcomingLot(isHighestBidder: false))],
            "highest bidder, and can re-bid": [.inActive(lotState: .upcomingLot(isHighestBidder: true))],
        ]

        for (_, tuple) in examples.enumerated() {

            it("has valid snapshot \(tuple.0)") {
                let viewModel = Test_BiddingViewModel()
                let subject = LiveAuctionBidButton(viewModel: viewModel)
                tuple.1.forEach { viewModel.progressSignal.update($0) }

                subject.frame = CGRect(x:0, y:0, width:260, height: 60)
                expect(subject) == snapshot()
            }
        }

        // This test can intermittently fail, it is one of the few tests that _actively_
        // use async (it kind of has to), and so it is known issue

        it("handles getting outbid with lot state changes before animation completes") {
            let viewModel = Test_BiddingViewModel()
            let subject = LiveAuctionBidButton(viewModel: viewModel)
            subject.outbidNoticeDuration = 0.05

            waitUntil { done in
                subject.outbidNoticeAnimationComplete = done
                viewModel.progressSignal.update(.active(biddingState: .bidBecameMaxBidder))
                viewModel.progressSignal.update(.active(biddingState: .biddable(askingPrice: 1000, currencySymbol: "")))
                viewModel.progressSignal.update(.inActive(lotState: .closedLot(wasPassed: false)))
            }

            subject.frame = CGRect(x:0, y:0, width:260, height: 60)
            expect(subject) == snapshot()
        }
    }
}

class Test_BiddingViewModel: LiveAuctionBiddingViewModelType {
    let progressSignal = Observable<LiveAuctionBidButtonState>()
    let bidPendingSignal = Observable<LiveAuctionBiddingProgressState>()
}

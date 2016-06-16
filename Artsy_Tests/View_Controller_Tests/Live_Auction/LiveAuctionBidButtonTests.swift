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
            "registration required": [.Active(biddingState: .UserRegistrationRequired)],
            "registration pending": [.Active(biddingState: .UserRegistrationPending)],
            "registration closed": [.Active(biddingState: .UserRegistrationClosed)],
            "biddable": [.Active(biddingState: .Biddable(askingPrice: 45_000_00, currencySymbol: "$"))],
            "in progress": [.Active(biddingState: .BiddingInProgress )],
            "failed": [.Active(biddingState: .BidNetworkFail)],
            "max bidder": [.Active(biddingState: .BidBecameMaxBidder)],
            "not max bidder": [.Active(biddingState: .BidBecameMaxBidder), .Active(biddingState: .Biddable(askingPrice: 1000, currencySymbol: ""))],
            "waiting": [.Active(biddingState: .LotWaitingToOpen)],
            "sold": [.Active(biddingState: .LotSold)],
            "closed": [.InActive(lotState: .ClosedLot(wasPassed: false))],
            "passed": [.InActive(lotState: .ClosedLot(wasPassed: true))],
            "upcoming": [.InActive(lotState: .UpcomingLot)],
        ]

        for (_, tuple) in examples.enumerate() {

            it("has valid snapshot \(tuple.0)") {
                let viewModel = Test_BiddingViewModel()
                let subject = LiveAuctionBidButton(viewModel: viewModel)
                tuple.1.forEach { viewModel.progressSignal.update($0) }

                subject.frame = CGRect(x:0, y:0, width:260, height: 60)
                expect(subject) == snapshot()
            }
        }

        it("handles getting outbid with lot state changes before animation completes") {
            let viewModel = Test_BiddingViewModel()
            let subject = LiveAuctionBidButton(viewModel: viewModel)
            subject.outbidNoticeDuration = 0.05

            waitUntil { done in
                subject.outbidNoticeAnimationComplete = done
                viewModel.progressSignal.update(.Active(biddingState: .BidBecameMaxBidder))
                viewModel.progressSignal.update(.Active(biddingState: .Biddable(askingPrice: 1000, currencySymbol: "")))
                viewModel.progressSignal.update(.InActive(lotState: .ClosedLot(wasPassed: false)))
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

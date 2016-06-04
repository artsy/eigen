import Quick
import Nimble
import Nimble_Snapshots
import Interstellar
import Foundation

@testable
import Artsy

class LiveAuctionBidButtonTests: QuickSpec {

    override func spec() {

        let examples:[String: [LiveAuctionBidButtonState]] = [
            "trial": [.Active(biddingState: .TrialUser)],
            "biddable": [.Active(biddingState: .Biddable(askingPrice: 45_000_00, currencySymbol: "$"))],
            "in progress": [.Active(biddingState: .BiddingInProgress )],
            "failed": [.Active(biddingState: .BidNetworkFail)],
            "max bidder": [.Active(biddingState: .BidSuccess)],
            "not max bidder": [.Active(biddingState: .BidSuccess), .Active(biddingState: .Biddable(askingPrice: 1000, currencySymbol: ""))],
            "waiting": [.Active(biddingState: .LotWaitingToOpen)],
            "sold": [.Active(biddingState: .LotSold)],
            "closed": [.InActive(lotState: .ClosedLot)],
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
            subject.outbidNoticeDuration = 0.05 // Set the duration we show the outbid notice to something small, then we'll spin for just longer than this before comparing snapshots.
            viewModel.progressSignal.update(.Active(biddingState: .BidSuccess))
            viewModel.progressSignal.update(.Active(biddingState: .Biddable(askingPrice: 1000, currencySymbol: "")))
            viewModel.progressSignal.update(.InActive(lotState: .ClosedLot))

            NSRunLoop.currentRunLoop().runUntilDate(NSDate().dateByAddingTimeInterval(0.1))

            subject.frame = CGRect(x:0, y:0, width:260, height: 60)
            expect(subject) == snapshot()
        }
    }
}

class Test_BiddingViewModel: LiveAuctionBiddingViewModelType {
    let progressSignal = Observable<LiveAuctionBidButtonState>()
    let bidPendingSignal = Observable<Bool>()
}

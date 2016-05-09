import Quick
import Nimble
import Nimble_Snapshots
import Interstellar

@testable
import Artsy

class LiveAuctionBidButtonTests: QuickSpec {

    override func spec() {

        let examples:[String: LiveAuctionBidButtonState] = [
            "trial": .Active(biddingState: .TrialUser),
            "biddable": .Active(biddingState: .Biddable(biddingAmount: "$45,000")),
            "in progress": .Active(biddingState: .BiddingInProgress ),
            "failed": .Active(biddingState: .BidNetworkFail),
            "max bidder": .Active(biddingState: .BidSuccess(isMaxBidder: true)),
            "not max bidder": .Active(biddingState: .BidSuccess(isMaxBidder: false)),
            "waiting": .Active(biddingState: .LotWaitingToOpen),
            "sold": .Active(biddingState: .LotSold),
            "closed": .InActive(lotState: .ClosedLot),
            "upcoming": .InActive(lotState: .UpcomingLot),
        ]
 
        for (_, tuple) in examples.enumerate() {

            it("has valid snapshot \(tuple.0)") {
                let subject = LiveAuctionBidButton()
                subject.frame = CGRect(x:0, y:0, width:260, height: 60)
                subject.progressSignal.update(tuple.1)
                expect(subject) == snapshot()
            }
        }
    }
}

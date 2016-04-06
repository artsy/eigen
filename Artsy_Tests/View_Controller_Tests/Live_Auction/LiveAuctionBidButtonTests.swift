import Quick
import Nimble
import Nimble_Snapshots
import Interstellar

@testable
import Artsy

class LiveAuctionBidButtonTests: QuickSpec {

    override func spec() {

        let examples:[LiveAuctionBidButtonState] = [
            .Active(biddingState: .Idle(biddingAmount: "$45,000")),
            .Active(biddingState: .InProgress ),
            .Active(biddingState: .NetworkFail),
            .Active(biddingState: .Success(isMaxBidder: true)),
            .Active(biddingState:.Success(isMaxBidder: false)),
            .InActive(lotState: .ClosedLot),
            .InActive(lotState: .UpcomingLot(distanceFromLive: 1)),
        ]

        for (i, state) in examples.enumerate() {

            it("has valid snapshot \(i)") {
                let subject = LiveAuctionBidButton()
                subject.frame = CGRect(x:0, y:0, width:260, height: 60)
                subject.progressSignal.update(state)
                expect(subject) == snapshot()
            }
        }
    }
}

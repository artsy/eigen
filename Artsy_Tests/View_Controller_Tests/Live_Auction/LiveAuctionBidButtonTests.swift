import Quick
import Nimble
import Nimble_Snapshots
import Interstellar
import UIKit

@testable
import Artsy

class LiveAuctionBidButtonTests: QuickSpec {

    override func spec() {

        let examples:[LiveAuctionBiddingProgressState] = [.Idle(biddingAmount: "$45,000"), .InProgress , .NetworkFail, .Success(isMaxBidder: true), .Success(isMaxBidder: false)]

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

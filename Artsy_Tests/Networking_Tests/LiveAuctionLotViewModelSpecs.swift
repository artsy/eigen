import Quick
import Nimble
import OHHTTPStubs
import Interstellar
@testable
import Artsy

class LiveAuctionLotViewModelSpec: QuickSpec {
    override func spec() {

        func bid(amount: Int, bidder: [String: AnyObject]) -> LiveEvent {
            return LiveEvent(JSON: [
                "type" : "FirstPriceBidPlaced",
                "id" : NSUUID().UUIDString,
                "cancelled" : false,
                "amountCents" : amount * 100,
                "bidder" : bidder
                ])
        }

        var subject: LiveAuctionLotViewModel!

        beforeEach {
            let lot = LiveAuctionLot(JSON: [:])
            let creds = BiddingCredentials(bidders: [], paddleNumber: "")
            subject = LiveAuctionLotViewModel(lot: lot, bidderCredentials: creds)
        }

        it("handles cancelling an existing bid") {
            let event = LiveEvent(JSON: ["type": "FirstPriceBidPlaced", "eventId": "1234"])
            subject.addEvents([event])
            expect(event.cancelled) == false

            let undo = LiveEvent(JSON: ["type": "LiveOperatorEventUndone", "eventId": "999", "event": ["eventId": "1234"] ])
            subject.addEvents([undo])
            expect(event.cancelled) == true
        }

        it("handles setting the right top bid for out of order bid events") {

            let event = bid(560_000, bidder: ["type": "ArtsyBidder", "bidderId": "23424"])
            let floorUnderBid = bid(550_000, bidder: ["type": "OfflineBidder"])
            subject.addEvents([event, floorUnderBid])

            expect(subject.topBidEvent?.bidAmountCents) == 560_000_00
        }

        it("exposes user facing events only via the eventCount, without including the top bid ") {
            let event = bid(550_000, bidder: ["type": "ArtsyBidder", "bidderId": "23653"])
            let event2 = bid(560_000, bidder: ["type": "ArtsyBidder", "bidderId": "23653"])
            subject.addEvents([event, event2])

            expect(subject.numberOfDerivedEvents) == 1
            expect(subject.topBidEvent) != nil

            /// ignores non-userfacing events
            let undo = LiveEvent(JSON: ["type": "LiveOperatorEventUndone", "eventId": "999", "event": ["eventId": "1234"] ])
            subject.addEvents([undo])

            expect(subject.numberOfDerivedEvents) == 1
        }
    }
}

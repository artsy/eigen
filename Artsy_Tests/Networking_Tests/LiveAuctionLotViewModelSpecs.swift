import Quick
import Nimble
import OHHTTPStubs
import Interstellar
@testable
import Artsy

class LiveAuctionLotViewModelSpec: QuickSpec {
    override func spec() {

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

            subject.updateWinningBidEventID(event.eventID)
            subject.addEvents([event, floorUnderBid])

            expect(subject.winningBidEvent?.bidAmountCents) == 560_000_00
        }

        it("exposes user facing events only via the eventCount") {
            let event = LiveEvent(JSON: ["type": "FirstPriceBidPlaced", "eventId": "1234"])
            subject.addEvents([event])

            expect(subject.numberOfDerivedEvents) == 1

            let undo = LiveEvent(JSON: ["type": "LiveOperatorEventUndone", "eventId": "999", "event": ["eventId": "1234"] ])
            subject.addEvents([undo])

            expect(subject.numberOfDerivedEvents) == 1
        }
    }
}

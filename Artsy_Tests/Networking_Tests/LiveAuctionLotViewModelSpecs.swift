import Quick
import Nimble
import OHHTTPStubs
import Interstellar
@testable
import Artsy

class LiveAuctionLotViewModelSpec: QuickSpec {
    override func spec() {

        it("handles cancelling an existing bid") {
            let lot = LiveAuctionLot(JSON: [:])
            let creds = BiddingCredentials(bidders: [], paddleNumber: "")

            let subject = LiveAuctionLotViewModel(lot: lot, bidderCredentials: creds)
            let event = LiveEvent(JSON: ["type": "FirstPriceBidPlaced", "eventId": "1234"])
            subject.addEvents([event])

            expect(event.cancelled) == false

            let undo = LiveEvent(JSON: ["type": "LiveOperatorEventUndone", "eventId": "999", "event": ["eventId": "1234"] ])
            subject.addEvents([undo])

            expect(event.cancelled) == true
        }

        it("exposes user facing events only via the eventCount") {
            let lot = LiveAuctionLot(JSON: [:])
            let creds = BiddingCredentials(bidders: [], paddleNumber: "")
            let subject = LiveAuctionLotViewModel(lot: lot, bidderCredentials: creds)
            let event = LiveEvent(JSON: ["type": "FirstPriceBidPlaced", "eventId": "1234"])
            subject.addEvents([event])

            expect(subject.numberOfDerivedEvents) == 1

            let undo = LiveEvent(JSON: ["type": "LiveOperatorEventUndone", "eventId": "999", "event": ["eventId": "1234"] ])
            subject.addEvents([undo])

            expect(subject.numberOfDerivedEvents) == 1
        }
    }
}

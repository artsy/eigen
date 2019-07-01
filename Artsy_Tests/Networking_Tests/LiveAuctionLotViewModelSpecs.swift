import Quick
import Nimble
import Interstellar

@testable
import Artsy

class LiveAuctionLotViewModelSpec: QuickSpec {
    override func spec() {

        var subject: LiveAuctionLotViewModel!

        let userID = "98721314"

        beforeEach {
            let lot = LiveAuctionLot(json: [:])
            let creds = BiddingCredentials(bidders: [], paddleNumber: "", userID: userID)
            subject = LiveAuctionLotViewModel(lot: lot!, bidderCredentials: creds)
        }

        it("handles cancelling an existing bid") {
            let event = LiveEvent(json: ["type": "FirstPriceBidPlaced", "eventId": "1234"])
            subject.addEvents([event!])

            expect(event?.cancelled) == false

            let undo = LiveEvent(json: ["type": "LiveOperatorEventUndone", "eventId": "999", "event": ["eventId": "1234"] ])
            subject.addEvents([undo!])

            expect(event?.cancelled) == true
        }

        it("handles setting the right top bid for out of order bid events") {
            let event = bid(560_000, bidder: ["type": "ArtsyBidder" as AnyObject, "bidderId": "23424" as AnyObject])
            let floorUnderBid = bid(550_000, bidder: ["type": "OfflineBidder" as AnyObject])

            subject.updateWinningBidEventID(event.eventID)
            subject.addEvents([event, floorUnderBid])

            expect(subject.winningBidEvent?.bidAmountCents) == 560_000_00
        }


        it("handles setting the right users top bid in cents") {
            // Manually setting all this in here because we're going authed
            // with bidder references for this auction
            let lot = LiveAuctionLot(json: [:])
            let creds = BiddingCredentials(bidders: [Bidder(json: ["id": userID, "qualified_for_bidding": true])], paddleNumber: "", userID: userID)
            subject = LiveAuctionLotViewModel(lot: lot!, bidderCredentials: creds)

            let floorUnderBid = bid(550_000, bidder: ["type": "OfflineBidder" as AnyObject])
            let usersBid = bid(560_000, bidder: ["type": "ArtsyBidder" as AnyObject, "bidderId": userID as AnyObject])
            let otherBid = bid(620_000, bidder: ["type": "ArtsyBidder" as AnyObject, "bidderId": "23424" as AnyObject])

            subject.addEvents([otherBid, usersBid, floorUnderBid])

            expect(subject.usersTopBidCents) == 560_000_00
        }

        it("exposes user facing events only via the eventCount") {
            let event = LiveEvent(json: ["type": "FirstPriceBidPlaced", "eventId": "1234"])
            subject.addEvents([event!])

            expect(subject.numberOfDerivedEvents) == 1

            let undo = LiveEvent(json: ["type": "LiveOperatorEventUndone", "eventId": "999", "event": ["eventId": "1234"] ])
            subject.addEvents([undo!])

            expect(subject.numberOfDerivedEvents) == 1
        }

        context("estimates") {
            let creds = BiddingCredentials(bidders: [], paddleNumber: "", userID: "")

            it("calculates highEstimateOrEstimateCents with only a highEstimate") {
                let lot = LiveAuctionLot(json: ["high_estimate_cents": 20000])
                subject = LiveAuctionLotViewModel(lot: lot!, bidderCredentials: creds)

                expect(subject.highEstimateOrEstimateCents) == 20000
            }

            it("calculates highEstimateOrEstimateCents with only an estimate") {
                let lot = LiveAuctionLot(json: ["estimate_cents": 30000])
                subject = LiveAuctionLotViewModel(lot: lot!, bidderCredentials: creds)

                expect(subject.highEstimateOrEstimateCents) == 30000

            }

            it("prefers a highEstimate when calculating highEstimateOrEstimateCents") {
                let lot = LiveAuctionLot(json: ["estimate_cents": 40000, "high_estimate_cents": 50000])
                subject = LiveAuctionLotViewModel(lot: lot!, bidderCredentials: creds)

                expect(subject.highEstimateOrEstimateCents) == 50000
            }
        }

        describe("uses the User's locale to return formatted dimensions") {
            let creds = BiddingCredentials(bidders: [], paddleNumber: "", userID: "")

            beforeEach {
                let lot = LiveAuctionLot(json: [
                    "artwork":
                        ["id": "the-artwork-id", "dimensions": [
                            "cm": "5x5cm",
                            "in": "2x2in"
                        ]]
                    ]
                )
                subject = LiveAuctionLotViewModel(lot: lot!, bidderCredentials: creds)
            }

            it("works for inches") {
                subject.usersLocale = Locale(identifier: "en-US")
                expect(subject.lotArtworkDimensions) == "2x2in"
            }

            it("works for centimeters") {
                subject.usersLocale = Locale(identifier: "en-CA")
                expect(subject.lotArtworkDimensions) == "5x5cm"
            }
        }
    }
}

import Quick
import Nimble
import Nimble_Snapshots
import Interstellar
import UIKit

@testable
import Artsy

class LiveAuctionBidHistoryViewControllerTests: QuickSpec {

    func setupCellWithEvent(event: LiveEvent) -> LiveAuctionHistoryCell {
        let lot = LiveAuctionLot(JSON: ["id": "", "symbol": "$" ])
        let creds = BiddingCredentials(bidders: [], paddleNumber: "123213")

        let lotVM = LiveAuctionLotViewModel(lot: lot, bidderCredentials: creds)
        lotVM.addEvents([event])

        let eventVM = lotVM.eventWithID(event.eventID)
        eventVM?.confirm()

        let subject = LiveAuctionHistoryCell(style: .Value1, reuseIdentifier: "")
        subject.frame = CGRect(x: 0, y: 0, width: 320, height: 50)

        subject.updateWithEventViewModel(eventVM!)
        return subject
    }

    override func spec() {
        describe("view controller") {

            var lotViewModel: Test_LiveAuctionLotViewModel!
            var subject: LiveAuctionBidHistoryViewController!

            beforeEach {
                lotViewModel = Test_LiveAuctionLotViewModel()
                subject = LiveAuctionBidHistoryViewController(lotViewModel: lotViewModel)
            }

            it("looks good by default") {
                expect(subject) == snapshot()
            }

            describe("after loading") {

                beforeEach {
                    subject.loadViewProgrammatically()
                }

                it("handles new event updates") {
                    lotViewModel.numberOfDerivedEvents = 2
                    lotViewModel.newEventsSignal.update([lotViewModel.derivedEventAtPresentationIndex(2)])
                    

                    expect(subject) == snapshot()
                }

                it("handles new event updates with mismatched counts") {
                    lotViewModel.newEventsSignal.update([lotViewModel.derivedEventAtPresentationIndex(2)])

                    expect(subject) == snapshot()
                }

                it("handles new event updates with empty new events") {
                    lotViewModel.numberOfDerivedEvents = 2
                    lotViewModel.cancelEvents = true

                    lotViewModel.newEventsSignal.update([])
                    
                    expect(subject) == snapshot()
                }
            }

        }

        describe("cells") {
            var subject: LiveAuctionHistoryCell!

            it("looks right for open") {
                let event = LiveEvent(JSON: ["type" : "BiddingOpened", "id" : "OK"])

                subject = self.setupCellWithEvent(event)
                expect(subject) == snapshot()
            }

            it("looks right for closed") {
                let event = LiveEvent(JSON: ["type" : "BiddingClosed", "id" : "OK"])

                subject = self.setupCellWithEvent(event)
                expect(subject) == snapshot()
            }

            it("looks right for closed state") {
                let event = LiveEvent(JSON: ["type" : "BiddingClosed", "id" : "OK", "cancelled" : true])

                subject = self.setupCellWithEvent(event)
                expect(subject) == snapshot()
            }

            it("looks right for bid") {
                let event = LiveEvent(JSON: [
                    "type" : "FirstPriceBidPlaced",
                    "id" : "ok",
                    "amountCents" : 555_000,
                    "bidder" : ["type": "ArtsyBidder", "bidderId": "LmnBN-aEci"]
                ])
                subject = self.setupCellWithEvent(event)
                expect(subject) == snapshot()
            }

            it("looks right for floor bid") {
                let event = LiveEvent(JSON: [
                    "type" : "FirstPriceBidPlaced",
                    "id" : "ok",
                    "amountCents" : 555_000,
                    "bidder" : ["type": "OfflineBidder"]
                    ])

                subject = self.setupCellWithEvent(event)
                expect(subject) == snapshot()
            }

            it("looks right for a cancelled floor bid") {
                let event = LiveEvent(JSON: [
                    "type" : "FirstPriceBidPlaced",
                    "id" : "ok",
                    "cancelled" : true,
                    "amountCents" : 555_000,
                    "bidder" : ["type": "OfflineBidder"]
                    ])

                subject = self.setupCellWithEvent(event)
                expect(subject) == snapshot()
            }

            it("looks right for final call") {
                let event = LiveEvent(JSON: ["type" : "FinalCall", "id" : "ok"])

                subject = self.setupCellWithEvent(event)
                expect(subject) == snapshot()
            }

            it("looks right for fair warning") {
                let event = LiveEvent(JSON: ["type" : "FairWarning", "id" : "ok"])

                subject = self.setupCellWithEvent(event)
                expect(subject) == snapshot()
            }
        }

        it("looks right on a comprehensive set of events") {
            // See:
            // e1   Lot Open
            // e2   Floor Bid - 10k
            // e3   Online Bid 23653 -  15k
            // e4   Confirmed
            // e5   You bid - 20k
            // e6   Confirmed
            // e7   Online bid - 23563 - 25k
            // e8   Confirmed
            // e9   Floor Bid - 30k
            // e10  Floor Bid - 35k
            // e11  You bid - 40,000k
            // e12  Confirmed

            let myBidderID = "123456"
            let lotID = NSUUID().UUIDString

            let lot = LiveAuctionLot(JSON: ["id": lotID])
            let creds = BiddingCredentials(bidders: [qualifiedBidder], paddleNumber: myBidderID)
            let lotVM = LiveAuctionLotViewModel(lot: lot, bidderCredentials: creds)

            let e1 = LiveEvent(JSON: ["type" : "BiddingOpened", "id" : lotID])
            let e2 = bid(10000, bidder: ["type" : "OfflineBidder"])
            let e3 = bid(15000, bidder: ["type": "ArtsyBidder", "bidderId": "23653"])
            let e4 = confirm(e3, lotID: lotID)
            let e5 = bid(20000, bidder: ["type": "ArtsyBidder", "bidderId": myBidderID])
            let e6 = confirm(e5, lotID: lotID)
            let e7 = bid(25000, bidder: ["type": "ArtsyBidder", "bidderId": "23653"])
            let e8 = confirm(e7, lotID: lotID)
            let e9 = bid(30000, bidder: ["type" : "OfflineBidder"])
            let e10 = bid(35000, bidder: ["type" : "OfflineBidder"])
            let e11 = bid(40000, bidder: ["type": "ArtsyBidder", "bidderId": myBidderID])
            let e12 = confirm(e11, lotID: lotID)

            let subject = LiveAuctionBidHistoryViewController(lotViewModel: lotVM)
            let events = [e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11, e12]
            lotVM.updateWinningBidEventID(e11.eventID)
            lotVM.addEvents(events as! [LiveEvent])

            expect(subject) == snapshot()
        }

        it("handles an out of order top bid event") {
            // See:
            // e1   Lot Open
            // e2   Floor Bid - 10k
            // e3   Online Bid 23653 -  15k
            // e4   Confirmed
            // e5   Floor Bid - 14k

            // Online bid should show at the top

            let myBidderID = "123456"
            let lotID = NSUUID().UUIDString

            let lot = LiveAuctionLot(JSON: ["id": lotID])
            let creds = BiddingCredentials(bidders: [qualifiedBidder], paddleNumber: myBidderID)
            let lotVM = LiveAuctionLotViewModel(lot: lot, bidderCredentials: creds)

            let e1 = LiveEvent(JSON: ["type" : "BiddingOpened", "id" : lotID])
            let e2 = bid(10000, bidder: ["type" : "OfflineBidder"])
            let e3 = bid(15000, bidder: ["type": "ArtsyBidder", "bidderId": "23653"])
            let e4 = confirm(e3, lotID: lotID)
            let e5 = bid(14000, bidder: ["type": "OfflineBidder"])

            let subject = LiveAuctionBidHistoryViewController(lotViewModel: lotVM)
            let events = [e1, e2, e3, e4, e5]
            lotVM.updateWinningBidEventID(e3.eventID)
            lotVM.addEvents(events as! [LiveEvent])
            
            expect(subject) == snapshot()
        }

    }
}

func bid(amount: Int, bidder: [String: AnyObject]) -> LiveEvent {
    return LiveEvent(JSON: [
        "type" : "FirstPriceBidPlaced",
        "eventId" : NSUUID().UUIDString,
        "cancelled" : false,
        "amountCents" : amount * 100,
        "bidder" : bidder
        ])
}

func confirm(event: LiveEvent, lotID: String) -> LiveEvent {
    return LiveEvent(JSON: [
        "amountCents": Int(event.amountCents),
        "createdAt": "2016-06-05T20:14:15.070Z",
        "event": ["eventId": event.eventID],
        "lotId": NSUUID().UUIDString,
        "type": "CompositeOnlineBidConfirmed"
        ])
}

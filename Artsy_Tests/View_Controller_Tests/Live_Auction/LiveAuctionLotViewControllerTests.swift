import Quick
import Nimble
import Nimble_Snapshots
import Interstellar
import UIKit

@testable
import Artsy

class LiveAuctionLotViewControllerTests: QuickSpec {
    override func spec() {
        describe("snapshots") {

            var subject: LiveAuctionLotViewController!
            var auctionViewModel: Test_LiveAuctionViewModel!
            var lotViewModel: Test_LiveAuctionLotViewModel!

            beforeEach {
                freezeTime()

                auctionViewModel = Test_LiveAuctionViewModel()
                lotViewModel = Test_LiveAuctionLotViewModel()
                subject = LiveAuctionLotViewController(index: 1, auctionViewModel: auctionViewModel, lotViewModel: lotViewModel, currentLotSignal: Signal())

            }

            afterEach {
                unfreezeTime()
            }

            // The indices are known to be the closed/live/upcoming states respectively
            it("looks good for closed lots") {
                lotViewModel.lotStateSignal.update(.ClosedLot)

                subject.loadViewProgrammatically()

                expect(subject).to( haveValidSnapshot() )
            }

            it("looks good for live lots") {
                lotViewModel.lotStateSignal.update(.LiveLot)

                subject.loadViewProgrammatically()

                expect(subject).to( haveValidSnapshot() )
            }

            it("looks good for upcoming lots") {
                lotViewModel.lotStateSignal.update(.UpcomingLot(distanceFromLive: 1))

                subject.loadViewProgrammatically()

                expect(subject).to( haveValidSnapshot() )
            }

            it("doesnt show a live auction call to action when auction is closed") {
                lotViewModel.lotStateSignal.update(.ClosedLot)
                auctionViewModel.saleAvailability = .Closed
                auctionViewModel.saleAvailabilitySignal.update(.Closed)

                subject.loadViewProgrammatically()

                expect(subject).to( haveValidSnapshot() )
            }

        }
    }
}

class Test_LiveAuctionViewModel: LiveAuctionViewModelType {
    var startDate = NSDate().dateByAddingTimeInterval(-3600)
    var lotCount = 3
    var saleAvailability = SaleAvailabilityState.Active
    var saleAvailabilitySignal = Signal(SaleAvailabilityState.Active)

    var distance: Int?
    func distanceFromCurrentLot(lot: LiveAuctionLot) -> Int? {
        return distance
    }
}

class Test_LiveAuctionLotViewModel: LiveAuctionLotViewModelType {
    var bidButtonTitleSignal = Signal("Bid Button Title")
    var lotArtist = "Artist Name"
    var estimateString = "$Estimate"
    var lotName = "Lot Name"
    var lotStateSignal = Signal(LotState.UpcomingLot(distanceFromLive: 1))
    var urlForThumbnail = NSURL(string: "http://example.com/")!
    var numberOfEvents = 1
    var lotIndex = 1
    var currentLotValue = "$Value"
    var imageProfileSize = CGSize(width: 200, height: 200)
    func eventAtIndex(index: Int) -> LiveAuctionEventViewModel {
        return LiveAuctionEventViewModel(event: LiveEvent(JSON: liveEventJSON))
    }

    let askingPriceSignal = Signal<Int>()
    let reserveStatusSignal = Signal<ARReserveStatus>()
    let startEventUpdatesSignal = Signal<NSDate>()
    let endEventUpdatesSignal = Signal<NSDate>()
    let newEventSignal = Signal<LiveAuctionEventViewModel>()
}

let liveEventJSON = [
    "id": "f89b33d8-b4ac-4cd1-a44f-fd8a0b7d669b",
    "type": "bid",
    "amountCents": 450000,
    "source": "floor",
    "isConfirmed": true
]


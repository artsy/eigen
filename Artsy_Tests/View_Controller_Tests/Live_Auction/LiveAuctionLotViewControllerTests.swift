import Quick
import Nimble
import Nimble_Snapshots
import Interstellar
import UIKit
import SDWebImage


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
                cacheColoredImageForURL(lotViewModel.urlForProfile)

                subject = LiveAuctionLotViewController(index: 1, auctionViewModel: auctionViewModel, lotViewModel: lotViewModel, currentLotSignal: Signal())
                subject.currentLotSignal.update(lotViewModel)
            }

            afterEach {
                unfreezeTime()
            }

            // The indices are known to be the closed/live/upcoming states respectively
            it("looks good for closed lots") {
                lotViewModel.lotStateSignal.update(.ClosedLot)
                expect(subject) == snapshot()
            }

            it("looks good for live lots") {
                lotViewModel.lotStateSignal.update(.LiveLot)
                expect(subject) == snapshot()
            }

            it("looks good for upcoming lots") {
                lotViewModel.lotStateSignal.update(.UpcomingLot(distanceFromLive: 1))
                expect(subject) == snapshot()
            }

            it("doesnt show a live auction call to action when auction is closed") {
                lotViewModel.lotStateSignal.update(.ClosedLot)
                auctionViewModel.saleAvailabilitySignal.update(.Closed)

                expect(subject) == snapshot()
            }
        }
    }

}

class Test_LiveAuctionViewModel: LiveAuctionViewModelType {
    var startDate = NSDate().dateByAddingTimeInterval(-3600)
    var lotCount = 3
    var saleAvailabilitySignal = Signal(SaleAvailabilityState.Active)
    var currentLotIDSignal = Signal<String>()

    var distance: Int?
    func distanceFromCurrentLot(lot: LiveAuctionLot) -> Int? {
        return distance
    }
}

class Test_LiveAuctionLotViewModel: LiveAuctionLotViewModelType {
    var lotArtist = "Artist Name"
    var estimateString = "$Estimate"
    var lotName = "Lot Name"
    var lotPremium = "Lot Premium"
    var lotArtworkCreationDate: String? = "1985"
    var urlForThumbnail = NSURL(string: "http://example.com/")!
    var urlForProfile = NSURL(string: "http://example.com/")!
    var reserveStatusString = "is testing reserve"
    var numberOfEvents = 1
    var lotIndex = 1
    var numberOfBids = 1
    var currentLotValue = UInt64(1234)
    var currentLotValueString = "$Value"
    var imageProfileSize = CGSize(width: 200, height: 200)
    var liveAuctionLotID = "lotID"
    func eventAtIndex(index: Int) -> LiveAuctionEventViewModel {
        return LiveAuctionEventViewModel(event: LiveEvent(JSON: liveEventJSON))
    }

    var lotStateSignal = Signal(LotState.UpcomingLot(distanceFromLive: 1))
    func computedLotStateSignal(auctionViewModel: LiveAuctionViewModelType) -> Signal<LotState> {
        return lotStateSignal
    }

    let askingPriceSignal = Signal<UInt64>()
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


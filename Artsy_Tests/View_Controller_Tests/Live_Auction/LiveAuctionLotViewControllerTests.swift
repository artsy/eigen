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

                subject = LiveAuctionLotViewController(index: 1, auctionViewModel: auctionViewModel, lotViewModel: lotViewModel, currentLotSignal: Observable<LiveAuctionLotViewModelType?>())

                subject.currentLotSignal.update(lotViewModel)
            }

            afterEach {
                unfreezeTime()
            }

            // The indices are known to be the closed/live/upcoming states respectively
            it("looks good for closed lots") {
                lotViewModel.lotStateSignal.update(.ClosedLot)
                lotViewModel.bidButtonState.update(.InActive(lotState: .ClosedLot))
                expect(subject) == snapshot()
            }

            it("looks good for live lots") {
                lotViewModel.lotStateSignal.update(.LiveLot)
                expect(subject) == snapshot()
            }

            it("looks good for upcoming lots") {
                auctionViewModel.distance = 1
                lotViewModel.bidButtonState.update(.InActive(lotState: .UpcomingLot))
                expect(subject) == snapshot()
            }

            it("doesnt show a live auction call to action when auction is closed") {
                lotViewModel.lotStateSignal.update(.ClosedLot)
                lotViewModel.bidButtonState.update(.InActive(lotState: .ClosedLot))
                auctionViewModel.saleAvailabilitySignal.update(.Closed)
                expect(subject) == snapshot()
            }

            it("looks good when its lot becomes the current lot") {
                lotViewModel.lotStateSignal.update(.LiveLot)
                auctionViewModel.currentLotSignal.update(lotViewModel)
                expect(subject) == snapshot()
            }
        }
    }

}

class Test_LiveAuctionViewModel: LiveAuctionViewModelType {
    var startDate = NSDate().dateByAddingTimeInterval(-3600)
    var lotCount = 3
    var saleAvailabilitySignal = Observable(SaleAvailabilityState.Active)
    var currentLotSignal = Observable<LiveAuctionLotViewModelType?>()

    var distance: Int?
    func distanceFromCurrentLot(lot: LiveAuctionLotViewModelType) -> Int? {
        return distance
    }
}

class Test_LiveAuctionLotViewModel: LiveAuctionLotViewModelType {
    var lotArtist = "Artist Name"
    var estimateString = "$Estimate"
    var lotName = "Lot Name"
    var lotID = "lot-id"
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
    func eventAtPresentationIndex(index: Int) -> LiveAuctionEventViewModel {
        return LiveAuctionEventViewModel(event: LiveEvent(JSON: liveEventJSON))
    }

    var lotStateSignal = Observable(LotState.UpcomingLot)
    func computedLotStateSignal(auctionViewModel: LiveAuctionViewModelType) -> Observable<LotState> {
        return lotStateSignal
    }

    let askingPriceSignal = Observable<UInt64>(5_000_00)
    let reserveStatusSignal = Observable<ARReserveStatus>()
    let startEventUpdatesSignal = Observable<NSDate>()
    let endEventUpdatesSignal = Observable<NSDate>()
    let newEventSignal = Observable<LiveAuctionEventViewModel>()
    let bidButtonState = Observable(LiveAuctionBidButtonState.Active(biddingState: .Biddable(askingPrice: 5_000_00)))
}

let liveEventJSON = [
    "lotId": "54c7ed2a7261692bfa910200",
    "eventId": "d74ee40f-9127-416c-8de7-21c0587df0d0",
    "amountCents": 450000,
    "createdAt": "2016-04-28T20:41:05.240Z",
    "type": "FirstPriceBidPlaced",
    "bidder": ["type":"OfflineBidder", "bidderId": "LmnBN-aFci" ]
]


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

        // This is test target-wide.
        beforeSuite {
            cacheColoredImageForURL(Test_LiveAuctionLotViewModel().urlForProfile)
        }

        describe("snapshots") {

            var subject: LiveAuctionLotViewController!
            var auctionViewModel: Test_LiveAuctionViewModel!
            var lotViewModel: Test_LiveAuctionLotViewModel!
            var salesPerson: LiveAuctionsSalesPersonType!

            beforeEach {
                freezeTime()

                auctionViewModel = Test_LiveAuctionViewModel()
                auctionViewModel.auctionState.insert(.UserIsRegistered)
                auctionViewModel.saleAvailabilitySignal.update( .Active(liveAuctionDate: nil) )
                lotViewModel = Test_LiveAuctionLotViewModel()
                salesPerson = stub_auctionSalesPerson(auctionViewModel)

                subject = LiveAuctionLotViewController(index: 1, lotViewModel: lotViewModel, salesPerson: salesPerson)

                salesPerson.currentLotSignal.update(lotViewModel)
            }

            afterEach {
                unfreezeTime()
            }

            // The indices are known to be the closed/live/upcoming states respectively
            it("looks good for sold lots") {
                lotViewModel.lotStateSignal.update(.ClosedLot(wasPassed: false))
                expect(subject) == snapshot()
            }

            it("looks good for passed lots") {
                lotViewModel.lotStateSignal.update(.ClosedLot(wasPassed: true))
                expect(subject) == snapshot()
            }

            it("looks good for live lots") {
                auctionViewModel.currentLotSignal.update(lotViewModel)
                lotViewModel.lotStateSignal.update(.LiveLot)
                expect(subject) == snapshot()
            }

            it("looks good for upcoming lots") {
                auctionViewModel.distance = 1
                lotViewModel.lotStateSignal.update(.UpcomingLot)
                expect(subject) == snapshot()
            }

            it("doesnt show a live auction call to action when auction is closed") {
                lotViewModel.lotStateSignal.update(.ClosedLot(wasPassed: false))
                auctionViewModel.saleAvailabilitySignal.update(.Closed)
                expect(subject) == snapshot()
            }

            it("looks good when its lot becomes the current lot") {
                lotViewModel.lotStateSignal.update(.LiveLot)
                auctionViewModel.currentLotSignal.update(lotViewModel)
                expect(subject) == snapshot()
            }

            it("looks good for lots with a met reserve") {
                lotViewModel.reserveStatusSignal.update(.ReserveMet)
                expect(subject) == snapshot()
            }

            it("looks good for lots with a (not yet met) reserve") {
                lotViewModel.reserveStatusSignal.update(.ReserveNotMet)
                expect(subject) == snapshot()
            }

            it("looks good for out-of-order lots") {
                auctionViewModel.distance = -1
                expect(subject) == snapshot()
            }

            it("handles updates to number of bids") {
                lotViewModel.numberOfBids = 1
                subject.loadViewProgrammatically()

                lotViewModel.numberOfBids = 2
                lotViewModel.newEventsSignal.update([])

                expect(subject) == snapshot()
            }
        }
    }

}

class Test_LiveAuctionViewModel: LiveAuctionViewModelType {
    var startDate = NSDate().dateByAddingTimeInterval(-3600)
    var liveAuctionStartDate = NSDate().dateByAddingTimeInterval(-3600)
    var lotCount = 3
    var saleAvailabilitySignal: Observable<SaleAvailabilityState> = Observable()
    var currentLotSignal = Observable<LiveAuctionLotViewModelType?>(Test_LiveAuctionLotViewModel(lotID: "active-lot"))
    var auctionState: ARAuctionState = .Default


    var distance: Int?
    func distanceFromCurrentLot(lot: LiveAuctionLotViewModelType) -> Int? {
        return distance
    }
}

class Test_LiveAuctionLotViewModel: LiveAuctionLotViewModelType {
    var lotArtist = "Artist Name"
    var lotArtistBlurb: String? = "Artist Blurb"
    var lotArtworkDescription: String? = "Ipsum lorem whatever."
    var lotArtworkMedium: String? = "Star stuff"
    var lotArtworkDimensions: String? = "140 x 420 cm"
    var estimateString: String? = "$Estimate"
    var lotName = "Lot Name"
    var lotID = "lot-id"
    var lotPremium = "Lot Premium"
    var lotArtworkCreationDate: String? = "1985"
    var urlForThumbnail = NSURL(string: "http://example.com/")!
    var urlForProfile = NSURL(string: "http://example.com/")!
    var reserveStatusString = "is testing reserve"
    var numberOfDerivedEvents = 1
    var lotIndex = 1
    var highEstimateCents: UInt64 = 2_000_00
    var numberOfBids = 1
    var currencySymbol = "$"
    var imageAspectRatio: CGFloat = 1
    var liveAuctionLotID = "lotID"
    var dateLotOpened: NSDate?
    var userIsHighestBidder: Bool = false
    var userIsBeingSoldTo: Bool = false
    var userIsWinning: Bool = false
    var isBeingSold: Bool = false
    // Whether or not (all) events returned from this test VM should be cancelled.
    var cancelEvents = false

    func derivedEventAtPresentationIndex(index: Int) -> LiveAuctionEventViewModel {
        let event = LiveAuctionEventViewModel(event: LiveEvent(JSON: liveEventJSON), currencySymbol: "$")
        event.confirm()
        event.bidStatus = .Bid(isMine: false, isTop: false)
        if cancelEvents { event.cancel() }
        return event
    }

    var lotStateSignal = Observable(LotState.UpcomingLot)
    func computedLotStateSignal(auctionViewModel: LiveAuctionViewModelType) -> Observable<LotState> {
        return lotStateSignal
    }

    let askingPrice: UInt64 = 5_000_00
    let askingPriceSignal = Observable<UInt64>(5_000_00)
    let reserveStatusSignal = Observable<ARReserveStatus>(.NoReserve)
    let newEventsSignal = Observable<[LiveAuctionEventViewModel]>()

    init(lotID: String) {
        self.lotID = lotID
    }

    init() {}
}

let liveEventJSON = [
    "lotId": "54c7ed2a7261692bfa910200",
    "eventId": "d74ee40f-9127-416c-8de7-21c0587df0d0",
    "amountCents": 450000,
    "createdAt": "2016-04-28T20:41:05.240Z",
    "type": "FirstPriceBidPlaced",
    "bidder": ["type":"ArtsyBidder", "bidderId": "LmnBN-aFci" ]
]

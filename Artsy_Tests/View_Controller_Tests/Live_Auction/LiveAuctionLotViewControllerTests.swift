import Quick
import Nimble
import Nimble_Snapshots
import Interstellar
import UIKit

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
                auctionViewModel.auctionState.insert(.userIsRegistered)
                auctionViewModel.saleAvailabilitySignal.update( .active(liveAuctionDate: nil) )
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
                lotViewModel.lotStateSignal.update(.closedLot(wasPassed: false))
                expect(subject) == snapshot()
            }

            it("looks good for won lots") {
                lotViewModel.isBeingSold = true
                lotViewModel.userIsBeingSoldTo = true
                lotViewModel.winningBidPrice = 6000_00
                lotViewModel.lotStateSignal.update(.closedLot(wasPassed: false))
                expect(subject) == snapshot()
            }

            it("looks good for passed lots") {
                lotViewModel.lotStateSignal.update(.closedLot(wasPassed: true))
                expect(subject) == snapshot()
            }

            it("looks good for live lots") {
                auctionViewModel.currentLotSignal.update(lotViewModel)
                lotViewModel.lotStateSignal.update(.liveLot)
                expect(subject) == snapshot()
            }

            it("looks good for upcoming lots") {
                auctionViewModel.distance = 1
                lotViewModel.lotStateSignal.update(.upcomingLot(isHighestBidder: false))
                expect(subject) == snapshot()
            }

            it("looks good for upcoming lots that the user is winning") {
                auctionViewModel.distance = 1
                lotViewModel.lotStateSignal.update(.upcomingLot(isHighestBidder: true))
                expect(subject) == snapshot()
            }

            it("doesnt show a live auction call to action when auction is closed") {
                lotViewModel.lotStateSignal.update(.closedLot(wasPassed: false))
                auctionViewModel.saleAvailabilitySignal.update(.closed)
                expect(subject) == snapshot()
            }

            it("looks good when its lot becomes the current lot") {
                lotViewModel.lotStateSignal.update(.liveLot)
                auctionViewModel.currentLotSignal.update(lotViewModel)
                expect(subject) == snapshot()
            }

            it("looks good for lots with a met reserve") {
                lotViewModel.reserveStatusSignal.update(.reserveMet)
                expect(subject) == snapshot()
            }

            it("looks good for lots with a (not yet met) reserve") {
                lotViewModel.reserveStatusSignal.update(.reserveNotMet)
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
                lotViewModel.numberOfBidsSignal.update(2)

                expect(subject) == snapshot()
            }
        }
    }
}

class Test_LiveAuctionViewModel: LiveAuctionViewModelType {
    var startDate = Date().addingTimeInterval(-3600)
    var liveAuctionStartDate = Date().addingTimeInterval(-3600)
    var lotCount = 3
    var saleAvailabilitySignal: Observable<SaleAvailabilityState> = Observable()
    var currentLotSignal = Observable<LiveAuctionLotViewModelType?>(Test_LiveAuctionLotViewModel(lotID: "active-lot"))
    var auctionState: ARAuctionState = []


    var distance: Int?
    func distanceFromCurrentLot(_ lot: LiveAuctionLotViewModelType) -> Int? {
        return distance
    }
}

class Test_LiveAuctionLotViewModel: LiveAuctionLotViewModelType {
    var userIsFloorWinningBidder: Bool = true

    var usersTopBidCents: UInt64? = 1_300_00

    var lotArtist = "Artist Name"
    var lotArtistBlurb: String? = "Artist Blurb"
    var lotArtworkDescription: String? = "Ipsum lorem whatever."
    var lotArtworkMedium: String? = "Star stuff"
    var lotArtworkDimensions: String? = "140 x 420 cm"
    var estimateString: String? = "$Estimate"
    var lotName = "Lot Name"
    var lotEditionInfo: String? = "Edition 7 of 10"
    var lotID = "lot-id"
    var lotPremium = "Lot Premium"
    var lotArtworkCreationDate: String? = "1985"
    var urlForThumbnail = URL(string: "http://example.com/")
    var urlForProfile = URL(string: "http://example.com/")
    var reserveStatusString = "is testing reserve"
    var numberOfDerivedEvents = 1
    var lotLabel: String? = "2"
    var highEstimateOrEstimateCents: UInt64? = 2_000_00
    var numberOfBids = 1
    var currencySymbol = "$"
    var imageAspectRatio: CGFloat = 1
    var liveAuctionLotID = "lotID"
    var dateLotOpened: Date?
    var userIsHighestBidder: Bool = false
    var userIsBeingSoldTo: Bool = false
    var userIsWinning: Bool = false
    var isBeingSold: Bool = false
    var winningBidPrice: UInt64? = nil
    // Whether or not (all) events returned from this test VM should be cancelled.
    var cancelEvents = false

    func derivedEventAtPresentationIndex(_ index: Int) -> LiveAuctionEventViewModel {
        let event = LiveAuctionEventViewModel(event: LiveEvent(json: liveEventJSON), currencySymbol: "$")
        event.confirm()
        event.bidStatus = .bid(isMine: false, isTop: false, userIsFloorWinningBidder: false)
        if cancelEvents { event.cancel() }
        return event
    }

    var lotStateSignal: Observable<LotState> = Observable(LotState.upcomingLot(isHighestBidder: false))
    func computedLotStateSignal(_ auctionViewModel: LiveAuctionViewModelType) -> Observable<LotState> {
        return lotStateSignal
    }

    let askingPrice: UInt64 = 5_000_00
    let askingPriceSignal = Observable<UInt64>(5_000_00)
    let numberOfBidsSignal = Observable<Int>()
    let reserveStatusSignal = Observable<ARReserveStatus>(.noReserve)
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
] as [String : Any]

import Quick
import Nimble
import Nimble_Snapshots
import Interstellar
import UIKit

@testable
import Artsy

class LiveAuctionPlaceMaxBidViewControllerSpecs: QuickSpec {
    override func spec() {
        var subject: LiveAuctionPlaceMaxBidViewController!

        // Ensure there is a key window for all of the tests
        var window: UIWindow?
        beforeSuite {
            window = UIWindow()
            window?.makeKeyAndVisible()
        }

        beforeEach {
            OHHTTPStubs.stubJSONResponse(forHost: "metaphysics*.artsy.net", withResponse: [:])
        }

        describe("updating") {
            var lotVM: Test_LiveAuctionLotViewModel!
            var salesPerson: Stub_LiveAuctionsSalesPerson!

            beforeEach {
                subject = StoryboardScene.LiveAuctions.instantiateBid()
                lotVM = Test_LiveAuctionLotViewModel()
                salesPerson = stub_auctionSalesPerson()
                subject.bidViewModel = LiveAuctionBidViewModel(lotVM: lotVM, salesPerson: salesPerson)
                subject.loadViewProgrammatically()
            }

            it("updates when new events come in") {
                expect(subject.priceOfCurrentBidsLabel.text) == "$Value"

                salesPerson.askingPriceValueString = "£200"
                lotVM.newEventsSignal.update([])

                expect(subject.priceOfCurrentBidsLabel.text) == "£200"
            }

            it("ensures that the minimum possible bid is at the asking price") {

                expect(subject.bidViewModel.currentBid) == 5_000_00

                lotVM.askingPrice = 6_000_00
                lotVM.askingPriceSignal.update(lotVM.askingPrice)
                lotVM.newEventsSignal.update([])

                expect(subject.bidViewModel.currentBid) == 6_000_00
            }
        }

        it("hides the progressview after recieving a lot event after the progress has shown") {
            subject = StoryboardScene.LiveAuctions.instantiateBid()
            let lotVM = Test_LiveAuctionLotViewModel()
            subject.bidViewModel = LiveAuctionBidViewModel(lotVM: lotVM, salesPerson:  stub_auctionSalesPerson())
            subject.loadViewProgrammatically()

            subject.biddingProgressSignal.update(.biddingInProgress)

//            TODO: manually verify what happened here
//            expect(subject.bidProgressOverlayView.superview) != nil

            subject.bidViewModel.lotViewModel.newEventsSignal.update([])
            expect(subject.bidProgressOverlayView.superview).to( beNil() )
        }

        // https://github.com/artsy/causality/blob/c9101610a8c169c2ff913b96065743d1a56117b4/src/main/scala/net/artsy/auction/domain/LotEventModel.scala#L401
        it("Handles converting the causality error message into human readable") {
            subject = StoryboardScene.LiveAuctions.instantiateBid()
            let lotVM = Test_LiveAuctionLotViewModel()
            subject.bidViewModel = LiveAuctionBidViewModel(lotVM: lotVM, salesPerson:  stub_auctionSalesPerson())
            subject.loadViewProgrammatically()

            let message = subject.bidProgressOverlayView.errorCodeToHumanReadable("ReservePriceChangeAfterLotIsSelling")
            expect(message).to( equal("Reserve price change after lot is selling") )
        }

        // TODO: These are failing only on Circle CI. Investigate why.
        xdescribe("networking") {

            let examples: [String: [LiveAuctionBiddingProgressState]] = [
                "in progress": [.biddingInProgress],
                "is max bidder": [.bidBecameMaxBidder],
                "not max bidder": [.bidOutbid],
                "network issues": [.bidNetworkFail],
                "waiting": [.lotWaitingToOpen],
                "sold": [.lotSold],
            ]

            for (_, tuple) in examples.enumerated() {

                it("has valid snapshot \(tuple.0)") {
                    subject = StoryboardScene.LiveAuctions.instantiateBid()
                    let lotVM = Test_LiveAuctionLotViewModel()
                    subject.bidViewModel = LiveAuctionBidViewModel(lotVM: lotVM, salesPerson: stub_auctionSalesPerson())
                    cacheColoredImageForURL(lotVM.urlForProfile)
                    subject.loadViewProgrammatically()

                    tuple.1.forEach { subject.biddingProgressSignal.update($0) }

                    expect(subject).to (haveValidSnapshot(named: nil, usesDrawRect: true))
                }
            }
        }
    }
}

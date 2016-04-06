import Quick
import Nimble
import Nimble_Snapshots
import Interstellar
import UIKit

@testable
import Artsy

class LiveAuctionBidViewControllerSpecs: QuickSpec {
    override func spec() {
        var subject: LiveAuctionBidViewController!

        beforeEach {
            OHHTTPStubs.stubJSONResponseAtPath("", withResponse: [:])
        }

        it("looks right on phones") {
            let devices:[ARDeviceType] = [.Phone4, .Phone6]
            for device in devices {
                ARTestContext.useDevice(device) {
                    subject = StoryboardScene.LiveAuctions.instantiateBid()

                    let fakeSalesPerson = stub_auctionSalesPerson()
                    let lotVM = fakeSalesPerson.lotViewModelForIndex(0)!
                    subject.bidViewModel = LiveAuctionBidViewModel(lotVM: lotVM)

                    expect(subject) == snapshot("bidding_on_\(device.rawValue)")
                }
            }
        }

        describe("updating") {
            var lotVM: Test_LiveAuctionLotViewModel!

            beforeEach {
                subject = StoryboardScene.LiveAuctions.instantiateBid()
                lotVM = Test_LiveAuctionLotViewModel()
                subject.bidViewModel = LiveAuctionBidViewModel(lotVM: lotVM)
                subject.loadViewProgrammatically()
            }

            it("updates when new events come in") {
                expect(subject.priceOfCurrentBidsLabel.text) == "$Value"

                lotVM.currentLotValueString = "£200"
                lotVM.endEventUpdatesSignal.update(NSDate())

                expect(subject.priceOfCurrentBidsLabel.text) == "£200"
            }

            it("ensures the bid is moved above the current max bid") {
                expect(subject.bidViewModel.currentBid) == 5000

                lotVM.currentLotValue = 15000
                lotVM.endEventUpdatesSignal.update(NSDate())

                expect(subject.bidViewModel.currentBid) == 15000
            }

        }
    }
}

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


            beforeEach {

            }

            // The indices are known to be the closed/live/upcoming states respectively
//            it("looks good for closed lots") {
//                let subject = LiveAuctionLotViewController(index: 1, auctionViewModel: <#T##LiveAuctionViewModel#>, lotViewModel: <#T##LiveAuctionLotViewModel#>, currentLotSignal: <#T##Signal<LiveAuctionLotViewModel>#>)
//                subject.loadViewProgrammatically()
//                expect(subject).to( haveValidSnapshot() )
//            }
//
//            it("looks good for live lots") {
//                let subject = LiveAuctionLotViewController(index: 1, auctionViewModel: <#T##LiveAuctionViewModel#>, lotViewModel: <#T##LiveAuctionLotViewModel#>, currentLotSignal: <#T##Signal<LiveAuctionLotViewModel>#>)
//                subject.loadViewProgrammatically()
//                expect(subject).to( haveValidSnapshot() )
//            }
//
//            it("looks good for upcoming lots") {
//                let subject = LiveAuctionLotViewController(index: 1, auctionViewModel: <#T##LiveAuctionViewModel#>, lotViewModel: <#T##LiveAuctionLotViewModel#>, currentLotSignal: <#T##Signal<LiveAuctionLotViewModel>#>)
//                subject.loadViewProgrammatically()
//                expect(subject).to( haveValidSnapshot() )
//            }

            it("doesnt show a live auction call to action when auction is closed") {
                let sale = try! LiveSale(dictionary: [ "startDate" : NSDate.distantPast(), "endDate" : NSDate.distantPast(), "currentLotId": "", "lotIDs": ["1"]], error: Void())

                let lot = try! LiveAuctionLot(dictionary: [:], error: Void())

                // TODO: Pack fake objects in with DI and test 🎉
                let subject = LiveAuctionLotViewController(index: 1,
                    auctionViewModel: LiveAuctionViewModel(sale: sale),
                    lotViewModel: LiveAuctionLotViewModel(lot: lot),
                    currentLotSignal: Signal())

                subject.loadViewProgrammatically()
                expect(subject).to( haveValidSnapshot() )
            }
            
        }
    }
}



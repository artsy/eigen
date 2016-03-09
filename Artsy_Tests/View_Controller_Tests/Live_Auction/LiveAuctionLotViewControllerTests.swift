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

            var salesPerson: Fake_AuctionsSalesPerson!
            beforeEach {
                salesPerson = Fake_AuctionsSalesPerson()
            }

            // The indices are known to be the closed/live/upcoming states respectively
            it("looks good for closed lots") {
                let subject = LiveAuctionLotViewController()
                subject.loadViewProgrammatically()
                subject.lotViewModel.update( salesPerson.lotViewModelForIndex(0)! )
                expect(subject).to( haveValidSnapshot() )
            }

            it("looks good for live lots") {
                let subject = LiveAuctionLotViewController()
                subject.loadViewProgrammatically()
                subject.lotViewModel.update( salesPerson.lotViewModelForIndex(1)! )
                expect(subject).to( haveValidSnapshot() )
            }

            it("looks good for upcoming lots") {
                let subject = LiveAuctionLotViewController()
                subject.loadViewProgrammatically()
                subject.lotViewModel.update( salesPerson.lotViewModelForIndex(2)! )
                expect(subject).to( haveValidSnapshot() )
            }

            it("doesnt show a live auction call to action when auction is closed") {
                salesPerson.sale = try! LiveSale(dictionary: [ "startDate" : NSDate.distantPast(), "endDate" : NSDate.distantPast(), "currentLotId": "", "lotIDs": ["1"]], error: Void())

                let subject = LiveAuctionLotViewController()
                subject.loadViewProgrammatically()
                subject.lotViewModel.update( salesPerson.lotViewModelForIndex(2)! )
                subject.auctionViewModel.update( salesPerson.auctionViewModel )
                expect(subject).to( haveValidSnapshot() )
            }
            
        }
    }
}



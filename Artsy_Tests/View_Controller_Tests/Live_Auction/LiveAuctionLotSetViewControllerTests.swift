import Quick
import Nimble
import Nimble_Snapshots
import Interstellar
import UIKit

@testable
import Artsy

class LiveAuctionLotSetViewControllerSpec: QuickSpec {
    override func spec() {

        sharedExamples("live auctions lot set") { (context: SharedExampleContext) in
            var horizontalSizeClass: UIUserInterfaceSizeClass!
            var device: ARDeviceType!

            beforeEach {
                horizontalSizeClass = UIUserInterfaceSizeClass(rawValue: context()["horizontalSizeClass"] as! Int)
                device = ARDeviceType(rawValue: context()["device"] as! Int)
                OHHTTPStubs.stubJSONResponseAtPath("/api/v1/sale/los-angeles-modern-auctions-march-2015", withResponse:[:])
            }

            it("looks good by default") {
                let fakeSalesPerson = stub_auctionSalesPerson(Test_LiveAuctionViewModel())
                let subject = LiveAuctionLotSetViewController(salesPerson: fakeSalesPerson, traitCollection: UITraitCollection.init(horizontalSizeClass: horizontalSizeClass))

                subject.stubTraitCollection(UITraitCollection(horizontalSizeClass: horizontalSizeClass))

                ARTestContext.useDevice(device) {
                    expect(subject).to( haveValidSnapshot() )
                }
            }
        }

        describe("regular horizontal size class ") {
            itBehavesLike("live auctions lot set") {
                return ["horizontalSizeClass": UIUserInterfaceSizeClass.Regular.rawValue, "device": ARDeviceType.Pad.rawValue] as NSDictionary
            }
        }

        describe("compact horizontal size class") {
            itBehavesLike("live auctions lot set") {
                return ["horizontalSizeClass": UIUserInterfaceSizeClass.Compact.rawValue, "device": ARDeviceType.Phone6.rawValue] as NSDictionary
            }
        }
    }
}

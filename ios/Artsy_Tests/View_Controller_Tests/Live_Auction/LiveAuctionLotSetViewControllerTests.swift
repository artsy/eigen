import Quick
import Nimble
import Nimble_Snapshots
import Interstellar
import UIKit

@testable
import Artsy

class LiveAuctionLotSetViewControllerSpec: QuickSpec {
    override func spec() {

        sharedExamples("live auctions lot set") { (context: @escaping SharedExampleContext) in
            var horizontalSizeClass: UIUserInterfaceSizeClass!
            var device: ARDeviceType!

            beforeEach {
                horizontalSizeClass = UIUserInterfaceSizeClass(rawValue: context()["horizontalSizeClass"] as! Int)
                device = ARDeviceType(rawValue: context()["device"] as! Int)
                OHHTTPStubs.stubJSONResponse(atPath: "/api/v1/sale/los-angeles-modern-auctions-march-2015", withResponse:[:])
                OHHTTPStubs.stubJSONResponse(atPath: "/api/v1/me/bidders", withResponse:[])
            }

            it("looks good by default") {
                ARTestContext.use(device) {
                    let fakeSalesPerson = stub_auctionSalesPerson(Test_LiveAuctionViewModel())
                    let subject = LiveAuctionLotSetViewController(salesPerson: fakeSalesPerson, useCompactLayout: (horizontalSizeClass == .compact))
                    subject.suppressJumpingToOpenLots = true

                    subject.stubTraitCollection(UITraitCollection(horizontalSizeClass: horizontalSizeClass))
                    expect(subject).to( haveValidSnapshot() )
                }
            }
        }

        describe("regular horizontal size class ") {
            itBehavesLike("live auctions lot set") {
                return ["horizontalSizeClass": UIUserInterfaceSizeClass.regular.rawValue, "device": ARDeviceType.pad.rawValue]
            }
        }

        describe("compact horizontal size class") {
            itBehavesLike("live auctions lot set") {
                return ["horizontalSizeClass": UIUserInterfaceSizeClass.compact.rawValue, "device": ARDeviceType.phone6.rawValue]
            }
        }

        describe("really compact horizontal size class") {
            itBehavesLike("live auctions lot set") {
                return ["horizontalSizeClass": UIUserInterfaceSizeClass.compact.rawValue, "device": ARDeviceType.phone4.rawValue]
            }
        }
    }
}

import Quick
import Nimble
import Nimble_Snapshots
import UIKit
import Interstellar
import Forgeries
import OCMock
@testable
import Artsy

class AuctionViewControllerTests: QuickSpec {
    override func spec() {
        var sale: Sale!
        var saleViewModel: SaleViewModel!

        sharedExamples("auctions view controller registration status") { (context: SharedExampleContext) in
            var horizontalSizeClass: UIUserInterfaceSizeClass!
            var device: ARDeviceType!

            var dateMock: OCMockObject!

            beforeEach {
                let now = NSDate()
                let endTime = now.dateByAddingTimeInterval(3600.9) // 0.9 is to cover the possibility a clock tick happens between this line and the next.
                dateMock = ARTestContext.freezeTime(now)

                sale = try! Sale(dictionary: ["saleID": "the-tada-sale", "name": "The 🎉 Sale", "endDate": endTime], error: Void())
                saleViewModel = SaleViewModel(sale: sale, saleArtworks: [])

                horizontalSizeClass = UIUserInterfaceSizeClass(rawValue: context()["horizontalSizeClass"] as! Int)
                device = ARDeviceType(rawValue: context()["device"] as! Int)
            }

            afterEach {
                dateMock.stopMocking()
            }

            it("looks good without a registration status") {
                let subject = AuctionViewController(saleID: sale.saleID)
                subject.allowAnimations = false
                subject.networkModel = Test_AuctionNetworkModel(saleViewModel: saleViewModel, registrationStatus: nil)
                subject.stubHorizontalSizeClass(horizontalSizeClass)

                ARTestContext.useDevice(device) {
                    expect(subject).to( haveValidSnapshot() )
                }
            }

            it("looks good when registereed") {
                let subject = AuctionViewController(saleID: sale.saleID)
                subject.allowAnimations = false
                subject.networkModel = Test_AuctionNetworkModel(saleViewModel: saleViewModel, registrationStatus: ArtsyAPISaleRegistrationStatusRegistered)
                subject.stubHorizontalSizeClass(horizontalSizeClass)

                ARTestContext.useDevice(device) {
                    expect(subject).to( haveValidSnapshot() )
                }
            }

            it("looks good when not logged in") {
                let subject = AuctionViewController(saleID: sale.saleID)
                subject.allowAnimations = false
                subject.networkModel = Test_AuctionNetworkModel(saleViewModel: saleViewModel, registrationStatus: ArtsyAPISaleRegistrationStatusNotLoggedIn)
                subject.stubHorizontalSizeClass(horizontalSizeClass)

                ARTestContext.useDevice(device) {
                    expect(subject).to( haveValidSnapshot() )
                }
            }

            it("looks good when not registered") {
                let subject = AuctionViewController(saleID: sale.saleID)
                subject.allowAnimations = false
                subject.networkModel = Test_AuctionNetworkModel(saleViewModel: saleViewModel, registrationStatus: ArtsyAPISaleRegistrationStatusNotRegistered)
                subject.stubHorizontalSizeClass(horizontalSizeClass)

                ARTestContext.useDevice(device) {
                    expect(subject).to( haveValidSnapshot() )
                }
            }
        }


        describe("regular horizontal size class ") {
            itBehavesLike("auctions view controller registration status") {
                return ["horizontalSizeClass": UIUserInterfaceSizeClass.Regular.rawValue, "device": ARDeviceType.Pad.rawValue] as NSDictionary
            }
        }

        describe("compact horizontal size class") {
            itBehavesLike("auctions view controller registration status") {
                return ["horizontalSizeClass": UIUserInterfaceSizeClass.Compact.rawValue, "device": ARDeviceType.Phone6.rawValue] as NSDictionary
            }
        }
    }
}

class Test_AuctionNetworkModel: AuctionNetworkModelType {
    let saleViewModel: SaleViewModel
    var registrationStatus: ArtsyAPISaleRegistrationStatus?

    init(saleViewModel: SaleViewModel, registrationStatus: ArtsyAPISaleRegistrationStatus?) {
        self.saleViewModel = saleViewModel
        self.registrationStatus = registrationStatus
    }

    func fetch() -> Signal<SaleViewModel> {
        return Signal(saleViewModel)
    }
}

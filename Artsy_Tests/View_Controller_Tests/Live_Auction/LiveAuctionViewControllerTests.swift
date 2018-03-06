import Quick
import Nimble
import Nimble_Snapshots
import UIKit
import Interstellar
import Forgeries

@testable
import Artsy

class LiveAuctionViewControllerTests: QuickSpec {
    override func spec() {
        var subject: LiveAuctionViewController!

        var auctionViewModel: Test_LiveAuctionViewModel!
        var fakeSalesPerson: Stub_LiveAuctionsSalesPerson!
        
        // Ensure there is a key window for all of the tests
        var window: UIWindow?
        beforeSuite {
            window = UIWindow()
            window?.makeKeyAndVisible()
        }

        beforeEach {
            OHHTTPStubs.stubJSONResponse(atPath: "/api/v1/sale/los-angeles-modern-auctions-march-2015", withResponse:[
                ["id": "1234"]
            ])
            OHHTTPStubs.stubJSONResponse(atPath: "/api/v1/me/bidders", withResponse:[:])


            auctionViewModel = Test_LiveAuctionViewModel()
            fakeSalesPerson = stub_auctionSalesPerson(auctionViewModel)
        }

        func setupViewControllerForPhone(_ singleLayout: Bool) {

            subject = LiveAuctionViewController(saleSlugOrID: "sale-id")

            subject.staticDataFetcher = Stubbed_StaticDataFetcher()
            subject.suppressJumpingToOpenLots = true

            subject.salesPersonCreator = { _,_,_  in
                return fakeSalesPerson
            }

            subject.stubHorizontalSizeClass(singleLayout ? .compact : .regular)
        }

        it("looks good by default") {
            setupViewControllerForPhone(true)
            expect(subject).to (haveValidSnapshot(named: nil, usesDrawRect: true))
        }

        it("handles splitting in an iPad") {
            setupViewControllerForPhone(false)
            ARTestContext.use(.pad) {
                subject.view.frame = CGRect(x: 0, y: 0, width: 1024, height: 768)

                expect(subject).to (haveValidSnapshot(usesDrawRect: true))
            }
        }

        it("shows an error screen when static data fails") {
            setupViewControllerForPhone(true)

            let fakeStatic = FakeStaticFetcher()
            subject.staticDataFetcher = fakeStatic

            subject.beginAppearanceTransition(true, animated: false)
            subject.view.frame = CGRect(x: 0, y: 0, width: 320, height: 480)
            subject.endAppearanceTransition()

            let result: StaticSaleResult = Result.error(LiveAuctionStaticDataFetcher.Error.jsonParsing)
            fakeStatic.fakeObserver.update(result)

            expect(subject).to (haveValidSnapshot(named: nil, usesDrawRect: true))
        }

        it("shows a socket disconnect screen when socket fails") {
            setupViewControllerForPhone(true)

            fakeSalesPerson.socketConnectionSignal.update(false)

            expect(subject).to (haveValidSnapshot(named: nil, usesDrawRect: true))
        }

        it("shows a removes disconnected screen when socket reconnects") {
            setupViewControllerForPhone(true)

            fakeSalesPerson.socketConnectionSignal.update(false)
            // Adds everything synchronously, which is the test above
            fakeSalesPerson.socketConnectionSignal.update(true)

            expect(subject).to (haveValidSnapshot(named: nil, usesDrawRect: true))
        }

        it("shows an operator disconnect screen when operator disconnects") {
            setupViewControllerForPhone(true)

            fakeSalesPerson.operatorConnectedSignal.update(false)

            expect(subject).to (haveValidSnapshot(named: nil, usesDrawRect: true))
        }

        it("shows an operator disconnected screen when operator reconnects") {
            setupViewControllerForPhone(true)

            fakeSalesPerson.operatorConnectedSignal.update(false)
            // Adds everything synchronously, which is the test above
            fakeSalesPerson.operatorConnectedSignal.update(true)

            expect(subject).to (haveValidSnapshot(named: nil, usesDrawRect: true))
        }
    }
}

class FakeStaticFetcher: LiveAuctionStaticDataFetcherType {
    let fakeObserver = Observable<StaticSaleResult>()
    func fetchStaticData() -> Observable<StaticSaleResult> {
        return fakeObserver
    }
}

import Quick
import Nimble
import Nimble_Snapshots
import UIKit
import Interstellar

@testable
import Artsy

class LiveAuctionViewControllerTests: QuickSpec {

    override func spec() {
        var subject: LiveAuctionViewController!

        beforeEach {
            let fake = stub_auctionSalesPerson()

            subject = LiveAuctionViewController(saleSlugOrID: "sale-id")
            subject.salesPersonCreator = { _ in return fake }

            for i in 0..<fake.lotCount {
                let lot = fake.lotViewModelForIndex(i)
                cacheColoredImageForURL(lot.urlForThumbnail)
            }
        }

        pending("looks good by default") {
            OHHTTPStubs.stubJSONResponseForHost("metaphysics*.artsy.net", withResponse: [:])

            subject.useSingleLayout = false
            expect(subject) == snapshot()
        }

        it("shows an error screen when static data fails") {
            subject.useSingleLayout = false

            let fakeStatic = FakeStaticFetcher()
            subject.staticDataFetcher = fakeStatic

            subject.beginAppearanceTransition(true, animated: false)
            subject.view.frame = CGRect(x: 0, y: 0, width: 320, height: 480)
            subject.endAppearanceTransition()

            let result:StaticSaleResult = Result.Error(LiveAuctionStaticDataFetcher.Error.JSONParsing)
            fakeStatic.fakeObserver.update(result)

            expect(subject) == snapshot()
        }


        pending("handles splitting in an iPad") {
            subject.useSingleLayout = false
            subject.beginAppearanceTransition(true, animated: false)
            subject.view.frame = CGRect(x: 0, y: 0, width: 1024, height: 768)
            subject.endAppearanceTransition()

            expect(subject).toEventually(haveValidSnapshot())
        }
    }
}

class FakeStaticFetcher: LiveAuctionStaticDataFetcherType {
    let fakeObserver = Observable<StaticSaleResult>()
    func fetchStaticData() -> Observable<StaticSaleResult> {
        return fakeObserver
    }
}
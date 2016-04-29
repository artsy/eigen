import Quick
import Nimble
import Nimble_Snapshots
import UIKit

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
            subject.useSingleLayout = false
            expect(subject).toEventually(haveValidSnapshot())
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

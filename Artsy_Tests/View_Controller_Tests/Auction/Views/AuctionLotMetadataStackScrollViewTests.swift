import Quick
import Nimble
import Nimble_Snapshots
import Interstellar
import UIKit

@testable
import Artsy

class AuctionLotMetadataStackScrollViewTests: QuickSpec {
    override func spec() {
        it("looks as expected when small") {
            let testVM = Test_LiveAuctionLotViewModel()
            let subject = AuctionLotMetadataStackScrollView(viewModel: testVM, salesPerson: stub_auctionSalesPerson(), sideMargin: "20")

            subject.backgroundColor = .white
            subject.constrainWidth("280")
            subject.layoutIfNeeded()

            expect(subject) == snapshot()

            // and isn't affected by additional labels
            guard let stack = subject.stackView as? TextStack else {
                return fail("Nope")
            }

            stack.addBodyText("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.")

            expect(subject) == snapshot()
        }

        it("looks right when expanded") {
            let wrapper = UIView(frame: CGRect(x: 0, y: 0, width: 280, height: 1000))
            let testVM = Test_LiveAuctionLotViewModel()
            let subject = AuctionLotMetadataStackScrollView(viewModel: testVM, salesPerson: stub_auctionSalesPerson(), sideMargin: "20")

            wrapper.addSubview(subject)
            subject.align(toView: wrapper)

            subject.backgroundColor = .white
            subject.showFullMetadata(false)

            expect(wrapper) == snapshot()
        }

    }
}

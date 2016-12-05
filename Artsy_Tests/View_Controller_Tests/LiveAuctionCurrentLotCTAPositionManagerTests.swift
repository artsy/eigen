import Quick
import Nimble
import Interstellar
import UIKit

@testable import Artsy

class LiveAuctionCurrentLotCTAPositionManagerTest: QuickSpec {
    override func spec() {
        var scrollView: UIScrollView!
        var salesPerson: Stub_LiveAuctionsSalesPerson!

        var subject: LiveAuctionCurrentLotCTAPositionManager!

        beforeEach {
            scrollView = UIScrollView(frame: CGRect(x: 0, y: 0, width: 100, height: 100))
            scrollView.contentSize = CGSize(width: 300, height: 100)
            salesPerson = stub_auctionSalesPerson()

            subject = LiveAuctionCurrentLotCTAPositionManager(salesPerson: salesPerson, bottomPositionConstraint: NSLayoutConstraint())
        }

        let currentLotIndex = 1
        let halfwayShowing: CGFloat = 47.5
        let hidden: CGFloat = 100
        let showing: CGFloat = -5

        describe("jumping directly to a lot") {
            it("works when jumping to the current lot") {
                salesPerson.currentFocusedLotIndex.update(currentLotIndex)

                expect(subject.bottomPositionConstraint.constant) == hidden
            }

            it("works when jumping to a non-current lot") {
                salesPerson.currentFocusedLotIndex.update(0)

                expect(subject.bottomPositionConstraint.constant) == showing
            }
        }

        describe("scrolling to a lot") {
            it("works when scrolling left to the current lot") {
                scrollView.contentOffset = CGPoint(x: 50, y: 0)
                salesPerson.currentFocusedLotIndex.update(currentLotIndex + 1)

                subject.scrollViewDidScroll(scrollView)

                expect(subject.bottomPositionConstraint.constant) == halfwayShowing
            }

            it("works when scrolling right to the current lot") {
                scrollView.contentOffset = CGPoint(x: 150, y: 0)
                salesPerson.currentFocusedLotIndex.update(currentLotIndex - 1)

                subject.scrollViewDidScroll(scrollView)

                expect(subject.bottomPositionConstraint.constant) == halfwayShowing
            }

            it("works when scrolling left away from the current lot") {
                scrollView.contentOffset = CGPoint(x: 50, y: 0)
                salesPerson.currentFocusedLotIndex.update(currentLotIndex)

                subject.scrollViewDidScroll(scrollView)

                expect(subject.bottomPositionConstraint.constant) == halfwayShowing
            }

            it("works when scrolling right away from the current lot") {
                scrollView.contentOffset = CGPoint(x: 150, y: 0)
                salesPerson.currentFocusedLotIndex.update(currentLotIndex)

                subject.scrollViewDidScroll(scrollView)

                expect(subject.bottomPositionConstraint.constant) == halfwayShowing
            }
        }
    }
}

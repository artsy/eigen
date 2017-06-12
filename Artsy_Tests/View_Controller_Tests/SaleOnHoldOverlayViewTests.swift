import Quick
import Nimble
import Nimble_Snapshots
import UIKit
import Then

@testable
import Artsy

class SaleOnHoldOverlayViewTests: QuickSpec {
    override func spec() {
        it("looks right by default on iPhone") {
            ARTestContext.use(.phone6) {
                let containerView = UIView().then {
                    $0.backgroundColor = .gray
                    $0.frame = UIScreen.main.bounds
                }

                let subject = SaleOnHoldOverlayView()
                containerView.addSubview(subject)
                subject.align(toView: containerView)

                expect(containerView).to( haveValidSnapshot() )
            }
        }

        it("looks right by default on iPad") {
            ARTestContext.use(.pad) {
                let containerView = UIView().then {
                    $0.backgroundColor = .gray
                    $0.frame = UIScreen.main.bounds
                }

                let subject = SaleOnHoldOverlayView()
                containerView.addSubview(subject)
                subject.align(toView: containerView)

                expect(containerView).to( haveValidSnapshot() )
            }
        }
    }
}

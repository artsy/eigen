import Quick
import Nimble
import Nimble_Snapshots
import UIKit
import Then

@testable
import Artsy

func runTheTest(message: String? = nil) {
    let containerView = UIView().then {
        $0.backgroundColor = .gray
        $0.frame = UIScreen.main.bounds
    }

    let subject = SaleOnHoldOverlayView(message: message)
    containerView.addSubview(subject)
    subject.align(toView: containerView)

    expect(containerView).to( haveValidSnapshot() )
}

class SaleOnHoldOverlayViewTests: QuickSpec {
    override func spec() {
        it("looks right by default on iPhone") {
            ARTestContext.use(.phone6) {
                runTheTest()
            }
        }

        it("looks right by default on iPad") {
            ARTestContext.use(.pad) {
                runTheTest()
            }
        }

        it("looks right with a custom message on iPhone") {
            ARTestContext.use(.phone6) {
                runTheTest(message: "This is a custom sale-on-hold message")
            }
        }

        it("looks right with a custom message on iPad") {
            ARTestContext.use(.pad) {
                runTheTest(message: "This is a custom sale-on-hold message")
            }
        }
    }
}

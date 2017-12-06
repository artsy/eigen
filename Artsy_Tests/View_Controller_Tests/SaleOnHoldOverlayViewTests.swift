import Quick
import Nimble
import Nimble_Snapshots
import UIKit
import Interstellar
import Then

@testable
import Artsy

func runTheTest(message: String? = nil) {
    let containerView = UIView().then {
        $0.backgroundColor = .gray
        $0.frame = UIScreen.main.bounds
    }

    let subject = SaleOnHoldOverlayView(messages: Observable(message))
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

        describe("updated sale-on-hold messages") {
            var containerView: UIView!
            var messages: Observable<String?>!
            beforeEach {
                containerView = UIView().then {
                    $0.backgroundColor = .gray
                    $0.frame = UIScreen.main.bounds
                }
                messages = Observable("initial message")
                let subject = SaleOnHoldOverlayView(messages: messages)
                containerView.addSubview(subject)
                subject.align(toView: containerView)
            }

            it("handles subsequent message updates") {
                expect(containerView).to( haveValidSnapshot(named: "initial message") )

                messages.update("subsequently updated message")
                // This expectation uses drawRect to delay the snapshot until after a subsequent render pass (for Autolayout to do its thing).
                expect(containerView).to( haveValidSnapshot(named: "updated message", usesDrawRect: true) )
            }
        }
    }
}

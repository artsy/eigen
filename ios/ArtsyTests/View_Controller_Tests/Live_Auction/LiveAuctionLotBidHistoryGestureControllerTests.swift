import Quick
import Nimble
import UIKit

@testable
import Artsy

class LiveAuctionLotBidHistoryGestureControllerTests: QuickSpec {
    override func spec() {
        var gestureRecognizer: ForgeryPanGestureRecognizer!
        var subject: LiveAuctionLotBidHistoryGestureController!
        var beginning: LiveAuctionLotBidHistoryGestureController.BeginClosure?
        var update: LiveAuctionLotBidHistoryGestureController.UpdateClosure?
        var completion: LiveAuctionLotBidHistoryGestureController.CompletionClosure?

        beforeEach {
            beginning = nil
            update = nil
            completion = nil
            gestureRecognizer = ForgeryPanGestureRecognizer()
            subject = LiveAuctionLotBidHistoryGestureController(gestureRecognizer: gestureRecognizer,
                begining: { originalState in
                    beginning?(originalState)
                }, update: { delta in
                    update?(delta)
                }, completion: { targetState in
                    completion?(targetState)
            })
            subject.openedPosition = 10
            subject.closedPosition = 20
        }

        it("closes when it's forced closed") {

        }

        it("disables the gesture recognizer when disabled itself") {
            subject.enabled = false

            expect(gestureRecognizer.isEnabled) == false
        }

        it("enables the gesture recognizer when enabled itself") {
            subject.enabled = false

            subject.enabled = true

            expect(gestureRecognizer.isEnabled) == true
        }

        describe("opening") {
            it("calls beginning closure") {
                var receivedInitialState: BidHistoryState?
                beginning = { initialState in
                    receivedInitialState = initialState
                }
                gestureRecognizer.testing_state = .began

                gestureRecognizer.invoke()

                expect(receivedInitialState) == .closed
            }

            it("sets its state to open during the opening") {
                gestureRecognizer.testing_state = .began

                gestureRecognizer.invoke()

                expect(subject.bidHistoryState == .open) == true
            }

            it("updates with delta") {
                var receivedDelta: CGFloat?
                update = { delta in
                    receivedDelta = delta
                }
                gestureRecognizer.testing_translation = CGPoint(x: 0, y: -5)
                gestureRecognizer.testing_state = .changed

                gestureRecognizer.invoke()

                expect(receivedDelta) == -5
            }

            it("calls ending closure to cancel") {
                var receivedTargetState: BidHistoryState?
                completion = { targetState in
                    receivedTargetState = targetState
                }
                gestureRecognizer.testing_velocity = CGPoint(x: 0, y: 5)
                gestureRecognizer.testing_state = .ended

                gestureRecognizer.invoke()

                expect(receivedTargetState) == .closed
            }

            it("calls ending closure to complete") {
                var receivedTargetState: BidHistoryState?
                completion = { targetState in
                    receivedTargetState = targetState
                }
                gestureRecognizer.testing_velocity = CGPoint(x: 0, y: -5)
                gestureRecognizer.testing_state = .ended

                gestureRecognizer.invoke()

                expect(receivedTargetState) == .open
            }

            it("updates its state once opened") {
                gestureRecognizer.state = .began
                gestureRecognizer.invoke()

                gestureRecognizer.testing_state = .ended
                gestureRecognizer.testing_velocity = CGPoint(x: 0, y: -5)
                gestureRecognizer.invoke()

                expect(subject.bidHistoryState == .open) == true
            }
        }

        describe("closing") {
            beforeEach {
                // "Open" the controller.
                gestureRecognizer.testing_state = .began
                gestureRecognizer.invoke()
                gestureRecognizer.testing_velocity = CGPoint(x: 0, y: -5)
                gestureRecognizer.testing_state = .ended
                gestureRecognizer.invoke()
            }

            it("calls beginning closure") {
                var receivedInitialState: BidHistoryState?
                beginning = { initialState in
                    receivedInitialState = initialState
                }
                gestureRecognizer.testing_state = .began

                gestureRecognizer.invoke()

                expect(receivedInitialState) == .open
            }

            it("calls ending closure to cancel") {
                var receivedTargetState: BidHistoryState?
                completion = { targetState in
                    receivedTargetState = targetState
                }
                gestureRecognizer.testing_velocity = CGPoint(x: 0, y: -5)
                gestureRecognizer.testing_state = .ended

                gestureRecognizer.invoke()

                expect(receivedTargetState) == .open
            }

            it("calls ending closure to complete") {
                var receivedTargetState: BidHistoryState?
                completion = { targetState in
                    receivedTargetState = targetState
                }
                gestureRecognizer.testing_velocity = CGPoint(x: 0, y: 5)
                gestureRecognizer.testing_state = .ended

                gestureRecognizer.invoke()

                expect(receivedTargetState) == .closed
            }
        }
    }
}

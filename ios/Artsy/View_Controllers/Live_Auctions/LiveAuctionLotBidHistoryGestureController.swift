import UIKit

enum BidHistoryState {
    case closed, open
}

class LiveAuctionLotBidHistoryGestureController: NSObject {

    typealias UpdateClosure = (_ delta: CGFloat) -> Void
    typealias CompletionClosure = (_ targetState: BidHistoryState) -> Void
    typealias BeginClosure = (_ originalState: BidHistoryState) -> Void

    let begining: BeginClosure
    let update: UpdateClosure
    let completion: CompletionClosure

    var closedPosition: CGFloat = 0
    var openedPosition: CGFloat = 0

    /// Change in the bid history state. There is no "opening" state, this updates only when interactions/animations complete.
    fileprivate(set) var bidHistoryState: BidHistoryState = .closed

    fileprivate var gestureRecognizer: UIGestureRecognizer?

    init(gestureRecognizer: UIGestureRecognizer, begining: @escaping BeginClosure, update: @escaping UpdateClosure, completion: @escaping CompletionClosure) {
        self.gestureRecognizer = gestureRecognizer
        self.begining = begining
        self.update = update
        self.completion = completion

        super.init()

        gestureRecognizer.addTarget(self, action: #selector(userDidDragToolbar))
    }

    fileprivate var _initialBidHistoryState: BidHistoryState = .closed

    @objc func userDidDragToolbar(_ gestureRecognizer: UIPanGestureRecognizer) {
        let translation = gestureRecognizer.translation(in: gestureRecognizer.view)
        let velocity = gestureRecognizer.velocity(in: gestureRecognizer.view)

        switch gestureRecognizer.state {
        case .began:
            _initialBidHistoryState = bidHistoryState

            self.begining(_initialBidHistoryState)

            // We'll be "open" for now, which is really shorthand for "opening", which will be set appropriately when the recognizer ends.
            bidHistoryState = .open

        case .changed:
            var delta: CGFloat // How far the view has moved from its initial, at rest position.

            switch _initialBidHistoryState {
            case .closed: // Opening
                delta = translation.y
            case .open:   // Closing
                delta = openedPosition - closedPosition + translation.y
            }

            delta.capAtMax(0, min: openedPosition - closedPosition)

            self.update(delta)

        case .ended:
            // Depending on the direction of the velocity, close or open the lot history.
            let targetState: BidHistoryState = velocity.y >= 0 ? .closed : .open

            self.completion(targetState)
            bidHistoryState = targetState
        default: break
        }
    }

    func forceCloseBidHistory() {
        bidHistoryState = .closed
    }
}

extension LiveAuctionLotBidHistoryGestureController {
    var enabled: Bool {
        set {
            self.gestureRecognizer?.isEnabled = newValue
        }
        get {
            return self.gestureRecognizer?.isEnabled ?? false
        }
    }
}

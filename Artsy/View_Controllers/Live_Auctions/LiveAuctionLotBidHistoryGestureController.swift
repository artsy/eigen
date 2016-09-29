import UIKit

enum BidHistoryState {
    case Closed, Open
}

class LiveAuctionLotBidHistoryGestureController: NSObject {

    typealias UpdateClosure = (delta: CGFloat) -> Void
    typealias CompletionClosure = (targetState: BidHistoryState) -> Void
    typealias BeginClosure = (originalState: BidHistoryState) -> Void

    let begining: BeginClosure
    let update: UpdateClosure
    let completion: CompletionClosure

    var closedPosition: CGFloat = 0
    var openedPosition: CGFloat = 0

    /// Change in the bid history state. There is no "opening" state, this updates only when interactions/animations complete.
    private(set) var bidHistoryState: BidHistoryState = .Closed

    private var gestureRecognizer: UIGestureRecognizer?

    init(gestureRecognizer: UIGestureRecognizer, begining: BeginClosure, update: UpdateClosure, completion: CompletionClosure) {
        self.gestureRecognizer = gestureRecognizer
        self.begining = begining
        self.update = update
        self.completion = completion

        super.init()

        gestureRecognizer.addTarget(self, action: #selector(userDidDragToolbar))
    }

    private var _initialBidHistoryState: BidHistoryState = .Closed

    func userDidDragToolbar(gestureRecognizer: UIPanGestureRecognizer) {
        let translation = gestureRecognizer.translationInView(gestureRecognizer.view)
        let velocity = gestureRecognizer.velocityInView(gestureRecognizer.view)

        switch gestureRecognizer.state {
        case .Began:
            _initialBidHistoryState = bidHistoryState

            self.begining(originalState: _initialBidHistoryState)

            // We'll be "open" for now, which is really shorthand for "opening", which will be set appropriately when the recognizer ends.
            bidHistoryState = .Open

        case .Changed:
            var delta: CGFloat // How far the view has moved from its initial, at rest position.

            switch _initialBidHistoryState {
            case .Closed: // Opening
                delta = translation.y
            case .Open:   // Closing
                delta = openedPosition - closedPosition + translation.y
            }

            delta.capAtMax(0, min: openedPosition - closedPosition)

            self.update(delta: delta)

        case .Ended:
            // Depending on the direction of the velocity, close or open the lot history.
            let targetState: BidHistoryState = velocity.y >= 0 ? .Closed : .Open

            self.completion(targetState: targetState)
            bidHistoryState = targetState
        default: break
        }
    }

    func forceCloseBidHistory() {
        bidHistoryState = .Closed
    }
}

extension LiveAuctionLotBidHistoryGestureController {
    var enabled: Bool {
        set {
            self.gestureRecognizer?.enabled = newValue
        }
        get {
            return self.gestureRecognizer?.enabled ?? false
        }
    }
}

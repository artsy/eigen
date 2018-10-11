// For creating single direction pan gestures:
// http://stackoverflow.com/questions/7100884/uipangesturerecognizer-only-vertical-or-horizontal

import UIKit
import UIKit.UIGestureRecognizerSubclass


/// Necessary when we have a gesture recognizer attached to a view within a scroll view.
/// This recognizer needs to set its state to cancelled if the initial velocity is in the
/// wrong direction. This allows, say, a vertical gesture recognizer to be added to a view
/// within a horizontally scrolling scrollview.
class PanDirectionGestureRecognizer: UIPanGestureRecognizer {

    enum PanDirection {
        case vertical
        case horizontal
    }

    let direction: PanDirection

    init(direction: PanDirection) {
        self.direction = direction
        super.init(target: nil, action: nil)
    }

    override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent) {
        super.touchesMoved(touches, with: event)
        guard let view = self.view else { return }

        if state == .began {
            let velocity = self.velocity(in: view)
            switch direction {
            case .horizontal where abs(velocity.y) > abs(velocity.x):
                state = .cancelled
            case .vertical where abs(velocity.x) > abs(velocity.y):
                state = .cancelled
            default:
                break
            }
        }
    }
}

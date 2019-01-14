import UIKit

protocol BottomSheetPassthroughScrollViewDelegate: class {
    
    func shouldTouchPassthroughScrollView(scrollView: BottomSheetPassthroughScrollView, point: CGPoint) -> Bool
    func viewToReceiveTouch(scrollView: BottomSheetPassthroughScrollView, point: CGPoint) -> UIView
}

class BottomSheetPassthroughScrollView: UIScrollView {
    
    weak var touchDelegate: BottomSheetPassthroughScrollViewDelegate?
    
    override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {
        
        if
            let touchDelegate = touchDelegate,
            touchDelegate.shouldTouchPassthroughScrollView(scrollView: self, point: point)
        {
            return touchDelegate.viewToReceiveTouch(scrollView: self, point: point).hitTest(touchDelegate.viewToReceiveTouch(scrollView: self, point: point).convert(point, from: self), with: event)
        }
        
        return super.hitTest(point, with: event)
    }
}

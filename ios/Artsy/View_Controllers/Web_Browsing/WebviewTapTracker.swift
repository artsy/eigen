class WebViewTapTracker: UITapGestureRecognizer {
    static var lastTapPoint: CGPoint?

    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent) {
        if let touch = touches.first, let view = self.view {
            WebViewTapTracker.lastTapPoint = touch.location(in: view)
        }
        super.touchesEnded(touches, with: event)
    }
}

import UIKit

class SimpleProgressView: UIView {

    override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .artsyColor(for: "black10")
    }

    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        backgroundColor = .artsyColor(for: "black10")
    }

    var highlightColor = UIColor.artsyColor(for: "devpurple") {
        didSet {
            setNeedsDisplay()
        }
    }

    var progress: CGFloat = 0 {
        didSet {
            setNeedsDisplay()
        }
    }

    override func draw(_ rect: CGRect) {
        let bg = UIBezierPath(rect: bounds)
        backgroundColor?.set()
        bg.fill()

        let progressRect = CGRect(x: 0, y: 0, width: Int(bounds.width * progress), height: Int(bounds.height))
        let fg = UIBezierPath(rect: progressRect)
        highlightColor?.set()
        fg.fill()
    }
}

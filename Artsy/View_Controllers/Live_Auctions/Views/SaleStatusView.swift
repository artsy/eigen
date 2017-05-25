import UIKit
import Artsy_UILabels
import EDColor

fileprivate let height: CGFloat = 32

class SaleStatusView: UIView {
    fileprivate let statusLabel = ARSerifLabel()
    fileprivate let backgroundView = UIView()

    override init(frame: CGRect) {
        super.init(frame: frame)
        
        constrainHeight("\(height)")
        
        // Set up red background view with a border.
        backgroundView.backgroundColor = UIColor.artsyRedRegular().withAlphaComponent(0.1)
        addSubview(backgroundView)
        backgroundView.alignTop("0", leading: "0", bottom: "0", trailing: "0", toView: self)
        backgroundView.layer.borderColor = UIColor.artsyRedRegular().cgColor
        backgroundView.layer.borderWidth = 1
        
        // Set up status label
        addSubview(statusLabel)
        statusLabel.backgroundColor = .clear
        statusLabel.alignLeading("20", trailing: "-20", toView: backgroundView)
        // top 2 is to make it visually centred
        statusLabel.alignTop("2", bottom: "0", toView: backgroundView)
        statusLabel.textColor = .artsyRedRegular()
        statusLabel.textAlignment = .center
        statusLabel.text = "Sale on Hold"
    }
    
    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    class func barButtonItem(adjustedLeftMarginBy leftMargin: CGFloat = 0) -> UIBarButtonItem {
        let saleStatusView = SaleStatusView()

        // So there's a bug in iOS 9 (fixed in iOS 10) that we need to work around.
        // The bug is that UIBarButtonItems with custom views don't respect autolayout.
        // So on iOS 10+, we use a standard view + AL, but on older devices we use ContainerView() as a workaround.
        let containerView: UIView
        if #available(iOS 10, *) {
            containerView = UIView()
            containerView.addSubview(saleStatusView)
            containerView.alignTop("0", leading: "\(-leftMargin)", bottom: "0", trailing: "0", toView: saleStatusView)
        } else {
            containerView = ContainerView().then {
                $0.offset = leftMargin
                $0.frame.size.height = height
                $0.frame.size.width = 150 // 150 should be big enough of "Sale on Hold"
            }
            containerView.addSubview(saleStatusView)
        }
        return UIBarButtonItem(customView: containerView)
    }
}

// A class to work around an iOS 9.x bug. It sets all subviews' frames to its own bounds (plus a horizontal offset).
fileprivate class ContainerView: UIView {
    var offset: CGFloat = 0
    override func layoutSubviews() {
        super.layoutSubviews()

        subviews.forEach { subview in
            subview.frame = bounds
            subview.frame.origin.x = offset
        }
    }
}

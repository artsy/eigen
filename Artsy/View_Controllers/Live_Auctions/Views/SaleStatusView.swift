import UIKit
import Artsy_UILabels
import EDColor

class SaleStatusView: UIView {
    fileprivate let statusLabel = ARSerifLabel()
    fileprivate let backgroundView = UIView()

    override init(frame: CGRect) {
        super.init(frame: frame)
        
        constrainHeight("32")
        
        // Set up red background view with a border.
        backgroundView.backgroundColor = UIColor.artsyRedRegular().withAlphaComponent(0.1)
        addSubview(backgroundView)
        // 4 leading is for a strange horizontal offset from UIKit.
        backgroundView.alignTop("0", leading: "4", bottom: "0", trailing: "0", toView: self)
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
    
    class func barButtonItem() -> UIBarButtonItem {
        return UIBarButtonItem(customView: SaleStatusView())
    }
}

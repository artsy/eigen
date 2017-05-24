import UIKit
import Artsy_UILabels
import EDColor

class SaleStatusView: UIView {
    
    let statusLabel = ARSerifLabel()

    override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = UIColor.artsyRedRegular().withAlphaComponent(0.1)
        addSubview(statusLabel)
        statusLabel.backgroundColor = .clear
        statusLabel.alignTop("10", leading: "10", bottom: "-10", trailing: "-10", toView: self)
        statusLabel.textColor = .artsyRedRegular()
        statusLabel.textAlignment = .center
    }
    
    required init?(coder aDecoder: NSCoder) {
        return nil
    }
    
    func setMessage(_ message: String) {
        statusLabel.text = message
    }
}

import UIKit
import Then

class AuctionBuyNowView: UIView {
    let isCompact: Bool
    
    init(isCompact: Bool) {
        self.isCompact = isCompact
        
        super.init(frame: CGRect.zero)
        
        setup()
    }
    
    required init?(coder aDecoder: NSCoder) {
        return nil
    }
}

private typealias PrivateFunctions = AuctionBuyNowView
extension PrivateFunctions {
    func setup() {
        let titleView = AuctionBuyNowTitleView(isCompact: isCompact)
        addSubview(titleView)
        titleView.alignTopEdge(withView: self, predicate: "0")
        titleView.alignLeading("0", trailing: "0", toView: self)
        titleView.alignBottomEdge(withView: self, predicate: "0")
        
        let bottomBorder = UIView().then {
            $0.backgroundColor = UIColor.artsyGrayRegular()
            $0.constrainHeight("1")
        }
        addSubview(bottomBorder)
        bottomBorder.alignBottomEdge(withView: self, predicate: "0")
        bottomBorder.alignLeading("0", trailing: "0", toView: self)
    }
}


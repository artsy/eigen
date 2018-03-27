import UIKit
import Then

class AuctionBuyNowTitleView: UIView {
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

private typealias PrivateFunctions = AuctionBuyNowTitleView
extension PrivateFunctions {
    func setup() {
        let titleLabel = ARSerifLabel().then {
            $0.text = "Buy Now"
            $0.font = UIFont.serifFont(withSize: isCompact ? 20 : 30)
            $0.textAlignment = isCompact ? .left : .center
        }
        
        addSubview(titleLabel)
        
        let sideSpacing = isCompact ? "20" : "40"
        let trailingSpacing = "-\(sideSpacing)"
        let borderColor = UIColor.artsyGrayRegular()
        
        if isCompact {
            titleLabel.alignTop("20", leading: sideSpacing, bottom: "0", trailing: trailingSpacing, toView: self)
            
            let topBorder = UIView().then {
                $0.backgroundColor = borderColor
                $0.constrainHeight("1")
                addSubview($0)
            }
            topBorder.alignTopEdge(withView: self, predicate: "0")
            topBorder.alignLeading("0", trailing: "0", toView: self)
        } else {
            titleLabel.alignTop("20", bottom: "-20", toView: self)
            titleLabel.alignCenterX(withView: self, predicate: "0")
            
            let borderConfig: (UIView) -> Void = {
                $0.backgroundColor = borderColor
                $0.constrainHeight("1")
                self.addSubview($0)
                $0.alignCenterY(withView: titleLabel, predicate: "0")
            }
            
            let leftBorder = UIView().then(borderConfig)
            let rightBorder = UIView().then(borderConfig)
            
            leftBorder.alignLeadingEdge(withView: self, predicate: sideSpacing)
            leftBorder.constrainTrailingSpace(toView: titleLabel, predicate: trailingSpacing)
            
            rightBorder.constrainLeadingSpace(toView: titleLabel, predicate: sideSpacing)
            rightBorder.alignTrailingEdge(withView: self, predicate: trailingSpacing)
        }
    }
}


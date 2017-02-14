import UIKit
import FLKAutoLayout

class LotStandingsLotView: UIView {
    typealias Config = (lotStanding: LotStanding, drawBottomBorder: Bool)
    var config: Config? {
        didSet {
            setup()
        }
    }
    
    static func fromNib(isCompact: Bool, lotStanding: LotStanding, drawBottomBorder: Bool) -> LotStandingsLotView? {
        let nibName = "LotStandingsLotView" + (isCompact ? "Compact" : "Regular")
        let nib = UINib(nibName: nibName, bundle: nil)

        guard let views = nib.instantiate(withOwner: nil, options: nil) as? [UIView] else {
            return nil
        }
        guard let view = views.first as? LotStandingsLotView else {
            return nil
        }

        view.translatesAutoresizingMaskIntoConstraints = false
        view.config = (lotStanding: lotStanding, drawBottomBorder: drawBottomBorder)
        view.constrainHeight(isCompact ? "140" : "120")

        return view
    }
}

private typealias PrivateFunctions = LotStandingsLotView
extension LotStandingsLotView {
    func setup() {
    }
}

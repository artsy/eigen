import UIKit

class LotStandingsLotView: UIView {
    init?(isCompact: Bool, lotStanding: LotStanding) {
        super.init(frame: CGRect.zero)

        translatesAutoresizingMaskIntoConstraints = false

        let nibName = "LotStandingsLotView" + (isCompact ? "Compact" : "Regular")
        let nib = UINib(nibName: nibName, bundle: nil)

        guard let views = nib.instantiate(withOwner: self, options: nil) as? [UIView] else {
            return nil
        }

        views.forEach { view in
            addSubview(view)
            view.align(toView: self)
        }

        setup()
    }

    required init?(coder aDecoder: NSCoder) {
        return nil
    }
}

private typealias PrivateFunctions = LotStandingsLotView
extension LotStandingsLotView {
    func setup() {

    }
}

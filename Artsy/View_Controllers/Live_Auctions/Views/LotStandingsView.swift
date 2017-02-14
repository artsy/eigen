import UIKit
import Then
import FLKAutoLayout

class LotStandingsView: UIView {
    let saleViewModel: SaleViewModel
    let isCompact: Bool

    init(saleViewModel: SaleViewModel, isCompact: Bool) {
        self.saleViewModel = saleViewModel
        self.isCompact = isCompact

        super.init(frame: CGRect.zero)

        setup()
    }
    
    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    override var intrinsicContentSize: CGSize {
        if saleViewModel.hasLotStandings {
            return super.intrinsicContentSize
        } else {
            return CGSize(width: UIViewNoIntrinsicMetric, height: 0)
        }
    }

    // TODO: Handle changing size class.
}

private typealias PrivateFunctions = LotStandingsView
extension PrivateFunctions {
    func setup() {
        let titleView = LotStandingsTitleView(isCompact: isCompact)
        addSubview(titleView)
        titleView.alignTopEdge(withView: self, predicate: "0")
        titleView.alignLeading("0", trailing: "0", toView: self)
    }
}

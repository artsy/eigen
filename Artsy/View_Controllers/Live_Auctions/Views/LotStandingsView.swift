import UIKit
import Then
import FLKAutoLayout

class LotStandingsView: UIView {
    let saleViewModel: SaleViewModel
    let isCompact: Bool

    fileprivate var titleView: LotStandingsTitleView?
    fileprivate var listView: LotStandingsLotListView?

    init(saleViewModel: SaleViewModel, isCompact: Bool) {
        self.saleViewModel = saleViewModel
        self.isCompact = isCompact

        super.init(frame: CGRect.zero)

        setup()
    }
    
    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    // TODO: Handle changing size class.
}

private typealias PrivateFunctions = LotStandingsView
extension PrivateFunctions {
    func setup() {
        guard saleViewModel.hasLotStandings else { return }

        let titleView = LotStandingsTitleView(isCompact: isCompact)
        addSubview(titleView)
        titleView.alignTopEdge(withView: self, predicate: "0")
        titleView.alignLeading("0", trailing: "0", toView: self)

        let listView = LotStandingsLotListView(saleViewModel: saleViewModel, isCompact: isCompact)
        addSubview(listView)
        listView.constrainTopSpace(toView: titleView, predicate: "0")
        listView.alignLeading("0", trailing: "0", toView: self)
        listView.alignBottomEdge(withView: self, predicate: isCompact ? "-10" : "-30")

        let bottomBorder = UIView().then {
            $0.backgroundColor = UIColor.artsyGrayMedium()
            $0.constrainHeight("1")
        }
        addSubview(bottomBorder)
        bottomBorder.alignBottomEdge(withView: self, predicate: "0")
        bottomBorder.alignLeading("0", trailing: "0", toView: self)

        self.listView = listView
        self.titleView = titleView

        setNeedsLayout()
    }
}

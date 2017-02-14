import UIKit
import ORStackView

class LotStandingsLotListView: ORStackView {
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
}

private typealias PrivateFunctions = LotStandingsLotListView
extension PrivateFunctions {
    func setup() {
        let sideMargin = isCompact ? "40" : "80"

        (0..<saleViewModel.numberOfLotStandings)
            .map { saleViewModel.lotStanding(at: $0) }
            .flatMap { LotStandingsLotView(isCompact: isCompact, lotStanding: $0) }
            .forEach { addSubview($0, withTopMargin: "0", sideMargin: sideMargin) }
    }
}

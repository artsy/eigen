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
        let numberOfLotStandings = saleViewModel.numberOfLotStandings

        (0..<numberOfLotStandings)
            .map { saleViewModel.lotStanding(at: $0) }
            .enumerated()
            .flatMap { (index, lotStanding) -> LotStandingsLotView? in
                let drawBottomBorder = (index != numberOfLotStandings - 1)
                return LotStandingsLotView.fromNib(isCompact: isCompact, lotStanding: lotStanding, drawBottomBorder: drawBottomBorder)
            }
            .forEach { addSubview($0, withTopMargin: "0", sideMargin: "0") }
    }
}

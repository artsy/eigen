import UIKit

class AuctionBannerView: UIView {
    let viewModel: SaleViewModel

    init(viewModel: SaleViewModel) {
        self.viewModel = viewModel
        super.init(frame: CGRect.zero)

        backgroundColor = .redColor()
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

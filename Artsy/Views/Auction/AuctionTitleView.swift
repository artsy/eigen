import UIKit

class AuctionTitleView: UIView {
    let viewModel: SaleViewModel

    init(viewModel: SaleViewModel) {
        self.viewModel = viewModel
        super.init(frame: CGRect.zero)

        backgroundColor = .orangeColor()
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    
    override func intrinsicContentSize() -> CGSize {
        return CGSize(width: 100, height: 100)
    }
}

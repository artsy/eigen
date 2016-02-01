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

    override func traitCollectionDidChange(previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)

        subviews.forEach { $0.removeFromSuperview() }
    }

    // Just temporary until we have real contents.
    override func intrinsicContentSize() -> CGSize {
        return CGSize(width: 100, height: 100)
    }
}

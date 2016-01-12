import UIKit
import Artsy_UIColors
import FLKAutoLayout
import SDWebImage

class AuctionBannerView: UIView {
    let viewModel: SaleViewModel

    // Note: These are in order as they'll be in the view hierarchy (ie: first in the list is at the back)
    private let backgroundImageView = UIImageView()
    private let darkeningView = DarkeningView()
    private let logoImageView = UIImageView()
    // TODO: Countdown view

    init(viewModel: SaleViewModel) {
        self.viewModel = viewModel
        super.init(frame: CGRect.zero)

        setupViews()
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    // TODO: Remove this, it shouldn't be required after Autolayout constraints are finished.
    override func intrinsicContentSize() -> CGSize {
        return CGSize(width: UIViewNoIntrinsicMetric, height: 197)
    }
}

extension AuctionBannerView {
    private func setupViews() {
        [backgroundImageView, darkeningView, logoImageView].forEach(^addSubview)

        backgroundImageView.alignToView(self)
        darkeningView.alignToView(self)
        logoImageView.alignTop("30", bottom: "30", toView: self)

        backgroundImageView.sd_setImageWithURL(viewModel.backgroundImageURL)
    }
}

private class DarkeningView: UIView {
    private override func didMoveToSuperview() {
        super.didMoveToSuperview()

        backgroundColor = UIColor(white: 0, alpha: 0.3)
    }
}

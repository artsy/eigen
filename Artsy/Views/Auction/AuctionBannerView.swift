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
}

extension AuctionBannerView {
    private func setupViews() {

        // Add all as subviews to self.
        [backgroundImageView, darkeningView, logoImageView].forEach(^addSubview)

        // Background + darkening view always cover self totally.
        backgroundImageView.alignToView(self)
        darkeningView.alignToView(self)

        // Device-specific layout for logo & countdown views.
        if UIDevice.isPad() {
            

            // TODO: Countdown view
        } else {
            logoImageView.alignTop("30", bottom: "-30", toView: self)
            logoImageView.alignCenterXWithView(self, predicate: "0")
            logoImageView.constrainHeight("70")

            // TODO: Countdown view
        }

        // Start any necessary image downloads.
        backgroundImageView.sd_setImageWithURL(viewModel.backgroundImageURL)
        logoImageView.sd_setImageWithURL(viewModel.profileImageURL)
    }
}

private class DarkeningView: UIView {
    private override func didMoveToSuperview() {
        super.didMoveToSuperview()

        backgroundColor = UIColor(white: 0, alpha: 0.3)
    }
}

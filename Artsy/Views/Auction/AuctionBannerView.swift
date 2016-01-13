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
        [backgroundImageView, darkeningView, logoImageView].forEach(apply(addSubview))

        // Background + darkening view always cover self totally.
        backgroundImageView.alignToView(self)
        darkeningView.alignToView(self)

        logoImageView.constrainWidth(nil, height: "70")

        // Device-specific layout for logo & countdown views.
        if UIDevice.isPad() {
            // Bottom lefthand corner with 40pt margin.
            logoImageView.alignLeadingEdgeWithView(self, predicate: "40")
            logoImageView.alignBottomEdgeWithView(self, predicate: "-40")

            // Must constraint self to 200pt tall on iPad, since our view hierarchy doesn't provide any height constraint and in its abses, defaults to the background image's height.
            constrainHeight("200")

            // TODO: Countdown view
        } else {
            // Logo is centred horizontally with 30pt above/below.
            logoImageView.alignTop("30", bottom: "-30", toView: self)
            logoImageView.alignCenterXWithView(self, predicate: "0")

            // TODO: Countdown view
        }

        // Start any necessary image downloads.
        backgroundImageView.sd_setImageWithURL(viewModel.backgroundImageURL)
        logoImageView.sd_setImageWithURL(viewModel.profileImageURL) { [weak logoImageView] (image, _, _, _) in
            // This keeps the image view constrained to the image's aspect ratio, which allows us to 'left align' this on iPad.
            let aspectRatio = image.size.width / image.size.height
            logoImageView?.constrainAspectRatio("\(aspectRatio)")
        }
    }
}

private class DarkeningView: UIView {
    private override func didMoveToSuperview() {
        super.didMoveToSuperview()

        backgroundColor = UIColor(white: 0, alpha: 0.3)
    }
}

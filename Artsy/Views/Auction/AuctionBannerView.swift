import UIKit
import Artsy_UIColors
import FLKAutoLayout
import SDWebImage

class AuctionBannerView: UIView {
    let viewModel: SaleViewModel

    private var countdownView: ARCountdownView?

    init(viewModel: SaleViewModel) {
        self.viewModel = viewModel
        super.init(frame: CGRect.zero)
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func willMoveToSuperview(newSuperview: UIView?) {
        super.willMoveToSuperview(newSuperview)

        // Countdown view only counts down when we have a superview.
        if let _ = newSuperview {
            countdownView?.startTimer()
        } else {
            countdownView?.stopTimer()
        }
    }

    override func traitCollectionDidChange(previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)

        // Remove all subviews and call setupViews() again to start from scratch.
        subviews.forEach { $0.removeFromSuperview() }
        setupViews()
    }
}

extension AuctionBannerView {
    private func setupViews() {

        // Note: These are in order as they'll be in the view hierarchy (ie: first in the list is at the back)
        let backgroundImageView = UIImageView().then {
            $0.contentMode = .ScaleAspectFill
            $0.clipsToBounds = true
        }
        let darkeningView = DarkeningView()
        let logoImageView = UIImageView()

        // Add all as subviews to self.
        [backgroundImageView, darkeningView, logoImageView].forEach(apply(addSubview))

        // Background + darkening view always cover self totally.
        backgroundImageView.alignToView(self)
        darkeningView.alignToView(self)

        if viewModel.saleIsClosed {
            let closedLabel = ARSansSerifHeaderLabel()
            closedLabel.text = "Auction Closed"
            closedLabel.textColor = .whiteColor()
            closedLabel.backgroundColor = .clearColor()
            darkeningView.addSubview(closedLabel)
            closedLabel.constrainWidthToView(self, predicate: "0@0")
            closedLabel.alignCenterWithView(darkeningView)

        } else {
            let countdownView = ARCountdownView(color: .whiteColor()).then {
                let model = self.viewModel

                switch model.saleAvailability {
                case .NotYetOpen:
                    $0.targetDate = model.startDate
                    $0.heading = "Opening In"

                case .Active(let liveAuctionStartDate):
                    if let liveStartDate = liveAuctionStartDate {
                        $0.targetDate = liveStartDate
                        $0.heading = "Starting Live Bidding In"

                    } else {
                        $0.targetDate = model.closingDate
                        $0.heading = "Closing In"
                    }
                    
                default: break // shouldn't happen
                }

                if let _ = self.superview {
                    $0.startTimer()
                }
            }
            self.countdownView = countdownView
            self.addSubview(countdownView)
        }

        logoImageView.constrainHeight("70")
        constrainHeight("200")

        // Device-specific layout for logo & countdown views.
        if traitCollection.horizontalSizeClass == .Regular {
            // Bottom lefthand corner with 40pt margin.
            logoImageView.alignLeadingEdgeWithView(self, predicate: "40")
            logoImageView.alignBottomEdgeWithView(self, predicate: "-40")


            // Bottom righthand corner with 40pt margin.
            countdownView?.alignTrailingEdgeWithView(self, predicate: "-40")
            countdownView?.alignBottomEdgeWithView(self, predicate: "-40")
        } else {

            logoImageView.alignTopEdgeWithView(self, predicate: "30")
            countdownView?.constrainTopSpaceToView(logoImageView, predicate: "7")
            countdownView?.alignBottomEdgeWithView(self, predicate: "-30")

            // The background will stretch us to be larger (based on its image height), so we want to prevent that.
            backgroundImageView.setContentCompressionResistancePriority(UILayoutPriorityDefaultLow, forAxis: .Vertical)

            logoImageView.alignCenterXWithView(self, predicate: "0")
            countdownView?.alignCenterXWithView(self, predicate: "0")
        }

        // Start any necessary image downloads.
        backgroundImageView.sd_setImageWithURL(viewModel.backgroundImageURL)
        logoImageView.sd_setImageWithURL(viewModel.profileImageURL) { [weak logoImageView] (image, _, _, _) in
            guard let image = image else { return }
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

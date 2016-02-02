import UIKit
import Artsy_UIButtons
import Artsy_UILabels
import Artsy_UIFonts
import FLKAutoLayout

protocol AuctionTitleViewDelegate: class {
}

class AuctionTitleView: UIView {
    unowned let delegate: AuctionTitleViewDelegate

    let viewModel: SaleViewModel
    var registrationStatus: ArtsyAPISaleRegistrationStatus? {
        didSet {
            // TODO: Update button title
        }
    }

    var registrationButton: UIButton!

    init(viewModel: SaleViewModel, registrationStatus: ArtsyAPISaleRegistrationStatus?, delegate: AuctionTitleViewDelegate) {
        self.viewModel = viewModel
        self.delegate = delegate
        self.registrationStatus = registrationStatus

        super.init(frame: CGRect.zero)

        setupViews()
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func traitCollectionDidChange(previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)

        // Remove all subviews and call setupViews() again to start from scratch.
        subviews.forEach { $0.removeFromSuperview() }
        setupViews()
    }
}

private extension AuctionTitleView {
    func setupViews() {
        let regularSize = traitCollection.horizontalSizeClass == .Regular

        let titleLabel = ARSerifLabel().then {
            $0.text = self.viewModel.displayName
            $0.font = UIFont.serifFontWithSize(regularSize ? 20 : 30)
        }
        addSubview(titleLabel)

        if regularSize {


        } else {
            
        }
        
    }
}

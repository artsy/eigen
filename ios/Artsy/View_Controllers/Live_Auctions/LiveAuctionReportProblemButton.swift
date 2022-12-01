//
//  LiveAuctionReportProblemButton.swift
//  Artsy
//
//  Created by Brian Beckerle on 10/31/22.
//

import Foundation

@objc protocol LiveAuctionReportProblemButtonDelegate {
    @objc func reportButtonReportedProblem()
}

class LiveAuctionReportProblemButton: ARFlatButton {
    var viewModel: LiveAuctionBiddingViewModelType

    // TODO: can we avoid this being an IBOutlet, that is funky
    weak var delegate: LiveAuctionReportProblemButtonDelegate?

    init(viewModel: LiveAuctionBiddingViewModelType) {
        self.viewModel = viewModel
        super.init(frame: CGRect.zero)
    }

    required init?(coder aDecoder: NSCoder) {
        // This is an acceptable default, it can be replaced before added to a view and setup() getting called.
        viewModel = LiveAuctionLeaveMaxBidButtonViewModel()
        super.init(coder: aDecoder)
    }

    override var intrinsicContentSize : CGSize {
        return CGSize(width: 48, height: 40)
    }

    override func setup() {
        super.setup()
        shouldDimWhenDisabled = false
        setContentCompressionResistancePriority(UILayoutPriority(rawValue: 1000), for: .vertical)
        addTarget(self, action: #selector(tappedReportButton), for: .touchUpInside)
        viewModel.progressSignal.subscribe(setupWithState)
    }

    @objc func tappedReportButton() {
        delegate?.reportButtonReportedProblem()
    }

    fileprivate func setupWithState(_ buttonState: LiveAuctionBidButtonState) {
        var shouldShowButton = false
        switch buttonState {
        case .active(biddingState: let biddingState):
            switch biddingState {
            case .userRegistrationClosed, .userRegistrationPending,
                    .userRegistrationRequired:
                shouldShowButton = true
                break
            default:
                shouldShowButton = false
                break
            }
        default:
            shouldShowButton = false
            break
        }
        setupUI("Report an Issue", background: white, border: .black, textColor: .black, hideButton: !shouldShowButton)
    }

    fileprivate func setupUI(_ title: String, background: UIColor = .black, border: UIColor? = nil, textColor: UIColor = UIColor.white, hideButton: Bool = false) {
        [UIControl.State.normal, .disabled].forEach { state in

            setAttributedTitle(NSAttributedString(string: title, attributes: [NSAttributedString.Key.foregroundColor: textColor]), for: state)

            let borderColor = border ?? background
            setBorderColor(borderColor, for: state, animated: false)
            setBackgroundColor(background, for: state)
        }

        self.isHidden = hideButton
    }
}

private let white = UIColor.white
private let purple = UIColor.artsyPurpleRegular()!
private let green = UIColor.artsyGreenRegular()!
private let red = UIColor.artsyRedRegular()!
private let grey = UIColor.artsyGrayRegular()!
private let greyMedium = UIColor.artsyGrayMedium()!
private let passedGrey = UIColor(white: 0, alpha: 0.5)

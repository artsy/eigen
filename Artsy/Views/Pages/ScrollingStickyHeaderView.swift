import Artsy_UILabels
import Artsy_UIButtons
import UIView_BooleanAnimations

/// Provides a ScrollingStickyHeaderView which can switch between two sizes
/// depending on whether it is stuck to the top of the screen

class ScrollingStickyHeaderView: UIView {

    let button: UIButton
    let titleLabel: UILabel
    let subtitleLabel: UILabel

    private let topSeparator: ARSeparatorView
    private let bottomSeparator: ARSeparatorView

    var stickyHeaderHeight: NSLayoutConstraint!

    var trailingConstraints: NSArray?
    var leadingConstraints: NSArray?

    init() {
        button = ARWhiteFlatButton().then {
            $0.setBorderColor(.artsyLightGrey(), forState: .Normal)
            $0.setBorderColor(UIColor.artsyLightGrey().colorWithAlphaComponent(0.5), forState: .Disabled)
            $0.layer.borderWidth = 1;
        }

        subtitleLabel = ARItalicsSerifLabel()
        titleLabel = ARSansSerifLabel()
        topSeparator = ARSeparatorView()
        bottomSeparator = ARSeparatorView()

        super.init(frame: CGRectZero)

        stickyHeaderHeight = self.constrainHeight("60").first as! NSLayoutConstraint
        backgroundColor = .whiteColor()

        button.then {
            self.addSubview($0)
            self.trailingConstraints = $0.alignTrailingEdgeWithView(self, predicate: "-20")
            $0.alignBottomEdgeWithView(self, predicate: "-15")
            $0.constrainHeight("24")
            $0.ar_extendHitTestSizeByWidth(0, andHeight: 10)
            $0.constrainWidth("60")
        }

        titleLabel.then {
            $0.textAlignment = .Center
            self.addSubview($0)
            $0.alignTopEdgeWithView(self, predicate: "4")
            $0.alignCenterXWithView(self, predicate: "0")
            $0.constrainWidthToView(self, predicate: "-128")
            $0.constrainHeight("60")
        }

        subtitleLabel.then {
            self.addSubview($0)
            self.leadingConstraints = $0.alignLeadingEdgeWithView(self, predicate: "20")
            $0.alignBottomEdgeWithView(self, predicate: "-18")
        }

        topSeparator.then {
            self.addSubview($0)
            $0.alignBottom("-55", trailing: "0", toView: self)
            $0.constrainWidthToView(self, predicate: "0")

        }
        bottomSeparator.then {
            self.addSubview($0)
            $0.alignBottom("0", trailing: "0", toView: self)
            $0.constrainWidthToView(self, predicate: "0")
        }
    }

    override func traitCollectionDidChange(previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)

        let margin: CGFloat = traitCollection.horizontalSizeClass == .Compact ? 20 : 40
        trailingConstraints?.forEach { constraint in
            (constraint as? NSLayoutConstraint)?.constant = -margin
        }
        leadingConstraints?.forEach { constraint in
            (constraint as? NSLayoutConstraint)?.constant = margin
        }
    }

    func toggleAttatched(atTop:Bool, animated: Bool) {
        UIView.animateIf(animated, duration: 0.2) {
            self.titleLabel.alpha = atTop ? 1 : 0
            self.topSeparator.alpha = atTop ? 1 : 0
            self.bottomSeparator.alpha = atTop ? 1 : 0
        }
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
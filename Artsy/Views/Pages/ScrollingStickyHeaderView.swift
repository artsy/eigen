import Artsy_UILabels
import Artsy_UIButtons
import UIView_BooleanAnimations

import SSFadingScrollView

/// Provides a ScrollingStickyHeaderView which can switch between two sizes
/// depending on whether it is stuck to the top of the screen

class ScrollingStickyHeaderView: UIView {

    let button: UIButton
    let titleLabel: UILabel
    let subtitleLabel: UILabel
    let subtitleScrollView: SSFadingScrollView

    fileprivate let topSeparator: ARSeparatorView
    fileprivate let bottomSeparator: ARSeparatorView

    var stickyHeaderHeight: NSLayoutConstraint!

    var trailingConstraints: NSLayoutConstraint?
    var leadingConstraints: NSLayoutConstraint?

    init() {
        button = ARWhiteFlatButton().then {
            $0.titleLabel?.font = UIFont.sansSerifFont(withSize: 12)
            $0.setBorderColor(.artsyGrayRegular(), for: .normal)
            $0.setBorderColor(UIColor.artsyGrayRegular().withAlphaComponent(0.5), for: .disabled)
            $0.layer.borderWidth = 1
        }

        subtitleScrollView = SSFadingScrollView()
        subtitleLabel = ARItalicsSerifLabel()
        titleLabel = ARSansSerifLabel()
        topSeparator = ARSeparatorView()
        bottomSeparator = ARSeparatorView()

        super.init(frame: CGRect.zero)

        stickyHeaderHeight = constrainHeight("60")
        backgroundColor = .white

        _ = button.then {
            self.addSubview($0)
            self.trailingConstraints = $0.alignTrailingEdge(withView: self, predicate: "-20")
            $0.alignBottomEdge(withView: self, predicate: "-13")
            $0.constrainHeight("30")
            $0.ar_extendHitTestSize(byWidth: 0, andHeight: 10)
            $0.constrainWidth("60")
        }

        _ = titleLabel.then {
            $0.textAlignment = .center
            $0.font = UIFont.sansSerifFont(withSize: 14)
            self.addSubview($0)
            $0.alignTopEdge(withView: self, predicate: "4")
            $0.alignCenterX(withView: self, predicate: "0")
            $0.constrainWidth(toView: self, predicate: "-128")
            $0.constrainHeight("60")
        }

        _ = subtitleScrollView.then {
            $0.fadeAxis = .horizontal
            $0.showsHorizontalScrollIndicator = false
            self.addSubview($0)
            $0.alignTop("0", bottom: "0", toView: self)
            leadingConstraints = $0.alignLeadingEdge(withView: self, predicate: "20")
            $0.constrainTrailingSpace(toView: button, predicate: "-10")
        }

        _ = subtitleLabel.then {
            subtitleScrollView.addSubview($0)
            $0.alignLeading("0", trailing: "0", toView: subtitleScrollView)
            $0.alignBaseline(withView: button, predicate: "0")
            $0.numberOfLines = 1
        }

        _ = topSeparator.then {
            self.addSubview($0)
            $0.alignBottom("-55", trailing: "0", toView: self)
            $0.constrainWidth(toView: self, predicate: "0")

        }
        _ = bottomSeparator.then {
            self.addSubview($0)
            $0.alignBottom("0", trailing: "0", toView: self)
            $0.constrainWidth(toView: self, predicate: "0")
        }
    }

    override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)

        let margin: CGFloat = traitCollection.horizontalSizeClass == .compact ? 20 : 40
        trailingConstraints?.constant = -margin
        leadingConstraints?.constant = margin
    }

    func toggleAttatched(_ atTop: Bool, animated: Bool) {

        UIView.animateIf(ARPerformWorkAsynchronously.boolValue && animated, duration: 0.2, {
            self.titleLabel.alpha = atTop ? 1 : 0
            self.topSeparator.alpha = atTop ? 1 : 0
            self.bottomSeparator.alpha = atTop ? 1 : 0
        }, completion: nil)
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

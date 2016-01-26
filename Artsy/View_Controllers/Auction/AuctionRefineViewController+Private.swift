import Artsy_UIButtons
import Artsy_UILabels
import Artsy_UIFonts
import ORStackView
import TTRangeSlider
import Then

private let CellIdentifier = "Cell"

extension AuctionRefineViewController {
    func setupViews() {
        let cancelButton = self.cancelButton()
        view.addSubview(cancelButton)
        cancelButton.alignTopEdgeWithView(view, predicate: "10")
        cancelButton.alignTrailingEdgeWithView(view, predicate: "-10")

        let titleLabel = ARSerifLabel().then {
            $0.font = UIFont.serifFontWithSize(20)
            $0.text = "Refine"
        }
        view.addSubview(titleLabel)
        titleLabel.alignTopEdgeWithView(view, predicate: "20")
        titleLabel.alignLeadingEdgeWithView(view, predicate: "20")

        let stackView = self.stackView()
        view.addSubview(stackView)
        stackView.alignBottomEdgeWithView(view, predicate: "-20")
        stackView.alignLeading("0", trailing: "0", toView: view)
    }
}

extension AuctionRefineViewController {
    func userDidCancel() {
        delegate?.userDidCancel(self)
    }

    func userDidPressApply() {
        delegate?.userDidApply(currentSettings, controller: self)
    }

    func userDidPressClear() {
        // Reset all UI back to its default settings, including a hard reload on the table view.
        currentSettings = defaultSettings
        sortTableView?.reloadData()
    }
}

private extension AuctionRefineViewController {

    func cancelButton() -> UIButton {
        let cancelButton = UIButton(type: .Custom)
        cancelButton.setImage(UIImage(named: "AuctionRefineCancelButton"), forState: .Normal)
        cancelButton.imageView?.contentMode = .ScaleAspectFit
        cancelButton.ar_extendHitTestSizeByWidth(4, andHeight: 4) // To expand to required 44pt hit area
        cancelButton.addTarget(self, action: "userDidCancel", forControlEvents: .TouchUpInside)
        return cancelButton
    }

    func subtitleLabel(text: String) -> UILabel {
        let label = ARSansSerifLabel()
        label.font = UIFont.sansSerifFontWithSize(12)
        label.text = text
        return label
    }

    func stackView() -> ORStackView {
        let stackView = ORStackView()

        stackView.addSubview(subtitleLabel("Sort"), withTopMargin: "20", sideMargin: "40")

        stackView.addSubview(ARSeparatorView(), withTopMargin: "10", sideMargin: "0")

        let tableView = UITableView().then {
            $0.registerClass(AuctionRefineTableViewCell.self, forCellReuseIdentifier: CellIdentifier)
            $0.scrollEnabled = false
            $0.separatorColor = .artsyLightGrey()
            $0.separatorInset = UIEdgeInsetsZero
            $0.dataSource = self
            $0.delegate = self
            let tableViewHeight = 44 * AuctionOrderingSwitchValue.allSwitchValues().count - 1 // -1 to cut off the bottom-most separator that we'll manually add below.
            $0.constrainHeight("\(tableViewHeight)")
        }
        stackView.addSubview(tableView, withTopMargin: "0", sideMargin: "40")

        stackView.addSubview(ARSeparatorView(), withTopMargin: "0", sideMargin: "0")

        stackView.addSubview(subtitleLabel("Price"), withTopMargin: "20", sideMargin: "40")

        let priceExplainLabel = ARSerifLabel().then {
            $0.font = UIFont.serifItalicFontWithSize(15)
            $0.text = "Based on the low estimates of the works"
        }
        stackView.addSubview(priceExplainLabel, withTopMargin: "10", sideMargin: "40")

        let applyButton = ARBlackFlatButton().then {
            $0.enabled = false
            $0.setTitle("Apply", forState: .Normal)
            $0.addTarget(self, action: "userDidPressApply", forControlEvents: .TouchUpInside)
        }

        let resetButton = ARWhiteFlatButton().then {
            $0.enabled = false
            $0.setTitle("Reset", forState: .Normal)
            $0.setBorderColor(.artsyLightGrey(), forState: .Normal)
            $0.setBorderColor(UIColor.artsyLightGrey().colorWithAlphaComponent(0.5), forState: .Disabled)
            $0.layer.borderWidth = 1
            $0.addTarget(self, action: "userDidPressClear", forControlEvents: .TouchUpInside)
        }

        let buttonContainer = UIView()
        buttonContainer.addSubview(resetButton)
        buttonContainer.addSubview(applyButton)

        UIView.alignTopAndBottomEdgesOfViews([resetButton, applyButton, buttonContainer])
        resetButton.alignLeadingEdgeWithView(buttonContainer, predicate: "0")
        resetButton.constrainTrailingSpaceToView(applyButton, predicate: "-20")
        applyButton.alignTrailingEdgeWithView(buttonContainer, predicate: "0")
        applyButton.constrainWidthToView(resetButton, predicate: "0")

        stackView.addSubview(buttonContainer, withTopMargin: "20", sideMargin: "40")

        self.applyButton = applyButton
        self.resetButton = resetButton
        self.sortTableView = tableView

        return stackView
    }
}

extension AuctionRefineViewController: UITableViewDataSource, UITableViewDelegate {
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return AuctionOrderingSwitchValue.allSwitchValues().count
    }

    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier(CellIdentifier, forIndexPath: indexPath)

        cell.textLabel?.text = AuctionOrderingSwitchValue.allSwitchValues()[indexPath.row].rawValue

        return cell
    }

    func tableView(tableView: UITableView, willDisplayCell cell: UITableViewCell, forRowAtIndexPath indexPath: NSIndexPath) {
        cell.layoutMargins = UIEdgeInsetsZero
        cell.preservesSuperviewLayoutMargins = false
        cell.textLabel?.font = UIFont.serifFontWithSize(16)
        cell.checked = currentSettings.ordering == AuctionOrderingSwitchValue.allSwitchValues()[indexPath.row]
    }

    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        tableView.deselectRowAtIndexPath(indexPath, animated: true)

        // Un-check formerly selected cell.
        if let oldCheckedCellIndex = AuctionOrderingSwitchValue.allSwitchValues().indexOf(currentSettings.ordering) {
            let cell = tableView.cellForRowAtIndexPath(NSIndexPath(forRow: oldCheckedCellIndex, inSection: 0))
            cell?.checked = false
        }

        // Change setting.
        currentSettings = currentSettings.settingsWithOrdering(AuctionOrderingSwitchValue.fromInt(indexPath.row))

        // Check newly selected cell.
        let cell = tableView.cellForRowAtIndexPath(indexPath)
        cell?.checked = true
    }
}

class AuctionRefineTableViewCell: UITableViewCell {
    override func layoutSubviews() {
        super.layoutSubviews()
        textLabel?.frame.origin.x = 0
    }
}

extension UITableViewCell {
    var checked: Bool {
        set(value) {
            if value {
                accessoryView = UIImageView(image: UIImage(named: "AuctionRefineCheck"))
            } else {
                accessoryView = nil
            }
        }
        get {
            return accessoryView != nil
        }
    }
}

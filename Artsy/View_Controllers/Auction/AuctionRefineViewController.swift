import UIKit
import Artsy_UIButtons
import Artsy_UILabels
import Artsy_UIFonts
import ORStackView

protocol AuctionRefineViewControllerDelegate: class {
    func userDidCancel(controller: AuctionRefineViewController)
    func userDidApply(settings: AuctionRefineSettings, controller: AuctionRefineViewController)
}

class AuctionRefineViewController: UIViewController {
    weak var delegate: AuctionRefineViewControllerDelegate?
    var applyButton: UIButton?

    var initialSettings = AuctionRefineSettings(ordering: AuctionOrderingSwitchValue.LotNumber) {
        didSet {
            // Our "current settings" _must_ be set to our initial settings.
            // Normally we'd use a lazy property for currentSettings but lazy properties can't have observers.
            currentSettings = initialSettings
        }
    }
    var currentSettings = AuctionRefineSettings(ordering: AuctionOrderingSwitchValue.LotNumber) {
        didSet {
            applyButton?.enabled = currentSettings != initialSettings
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        view.backgroundColor = .whiteColor()
        
        setupViews()
    }

    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)

        // Removes our rounded corners
        presentationController?.presentedView()?.layer.cornerRadius = 0
        UIApplication.sharedApplication().setStatusBarHidden(true, withAnimation: animated ? .Slide : .None)
    }

    override func viewWillDisappear(animated: Bool) {
        super.viewWillDisappear(animated)

        UIApplication.sharedApplication().setStatusBarHidden(true, withAnimation: animated ? .Slide : .None)
    }
}

extension AuctionRefineViewController {
    func userDidCancel() {
        delegate?.userDidCancel(self)
    }

    func userDidPressApply() {
        delegate?.userDidApply(currentSettings, controller: self)
    }
}

private let CellIdentifier = "Cell"

private extension AuctionRefineViewController {

    func setupViews() {
        let cancelButton = self.cancelButton()
        view.addSubview(cancelButton)
        cancelButton.alignTopEdgeWithView(view, predicate: "10")
        cancelButton.alignTrailingEdgeWithView(view, predicate: "-10")

        let titleLabel = self.titleLabel()
        view.addSubview(titleLabel)
        titleLabel.alignTopEdgeWithView(view, predicate: "20")
        titleLabel.alignLeadingEdgeWithView(view, predicate: "20")

        let stackView = self.stackView()
        view.addSubview(stackView)
        stackView.alignBottomEdgeWithView(view, predicate: "-20")
        stackView.alignLeading("0", trailing: "0", toView: view)
    }

    func cancelButton() -> UIButton {
        let cancelButton = UIButton(type: .Custom)
        cancelButton.setImage(UIImage(named: "AuctionRefineCancelButton"), forState: .Normal)
        cancelButton.imageView?.contentMode = .ScaleAspectFit
        cancelButton.ar_extendHitTestSizeByWidth(4, andHeight: 4) // To expand to required 44pt hit area
        cancelButton.addTarget(self, action: "userDidCancel", forControlEvents: .TouchUpInside)
        return cancelButton
    }

    func titleLabel() -> UILabel {
        let titleLabel = ARSerifLabel()
        titleLabel.font = UIFont.serifFontWithSize(20)
        titleLabel.text = "Refine"
        return titleLabel
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

        stackView.addSubview(Separator(), withTopMargin: "10", sideMargin: "0")

        let tableView = UITableView()
        tableView.registerClass(AuctionRefineTableViewCell.self, forCellReuseIdentifier: CellIdentifier)
        tableView.scrollEnabled = false
        tableView.separatorColor = .artsyLightGrey()
        tableView.separatorInset = UIEdgeInsetsZero
        tableView.dataSource = self
        tableView.delegate = self
        let tableViewHeight = 44 * AuctionOrderingSwitchValue.allSwitchValues().count - 1 // -1 to cut off the bottom-most separator that we'll manually add below.
        tableView.constrainHeight("\(tableViewHeight)")
        stackView.addSubview(tableView, withTopMargin: "0", sideMargin: "40")

        stackView.addSubview(Separator(), withTopMargin: "0", sideMargin: "0")

        let applyButton = ARBlackFlatButton()
        applyButton.enabled = false
        applyButton.setTitle("Apply", forState: .Normal)
        applyButton.addTarget(self, action: "userDidPressApply", forControlEvents: .TouchUpInside)
        stackView.addSubview(applyButton, withTopMargin: "20", sideMargin: "40")

        self.applyButton = applyButton

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

        if let oldCheckedCellIndex = AuctionOrderingSwitchValue.allSwitchValues().indexOf(currentSettings.ordering) {
            let cell = tableView.cellForRowAtIndexPath(NSIndexPath(forRow: oldCheckedCellIndex, inSection: 0))
            cell?.checked = false
        }

        currentSettings = AuctionRefineSettings(ordering: AuctionOrderingSwitchValue.fromInt(indexPath.row))

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

private class Separator: UIView {
    private override func willMoveToSuperview(newSuperview: UIView?) {
        backgroundColor = .artsyLightGrey()
    }

    private override func intrinsicContentSize() -> CGSize {
        return CGSize(width: UIViewNoIntrinsicMetric, height: 1)
    }
}

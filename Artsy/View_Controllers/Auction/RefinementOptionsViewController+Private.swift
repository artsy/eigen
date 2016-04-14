import Artsy_UIButtons
import Artsy_UILabels
import Artsy_UIFonts
import ORStackView
import Then
import MARKRangeSlider
import ARAnalytics

private let CellIdentifier = "Cell"

extension RefinementOptionsViewController {
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

    func updatePriceLabels() {
        guard let priceRange = currentSettings.priceRange else { return }
        minLabel?.text = priceRange.min.metricSuffixify()
        maxLabel?.text = priceRange.max.metricSuffixify()
    }

    func updateButtonEnabledStates() {
        let settingsDifferFromDefault = currentSettings != defaultSettings
        let settingsDifferFromInitial = currentSettings != initialSettings

        applyButton?.enabled = settingsDifferFromInitial
        resetButton?.enabled = settingsDifferFromDefault
    }
}

/// UISetup
private extension RefinementOptionsViewController {

    func cancelButton() -> UIButton {
        let cancelButton = UIButton.circularButton(.Cancel)
        cancelButton.addTarget(self, action: #selector(RefinementOptionsViewController.userDidCancel), forControlEvents: .TouchUpInside)
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

        tableViewHandler = RefinementOptionsViewControllerTableViewHandler.init(numberOfSections: currentSettings.numberOfSections,
            numberOfRowsInSection: { [unowned self] section in self.currentSettings.numberOfRowsInSection(section) },
            titleForRowAtIndexPath: { [unowned self] indexPath in self.currentSettings.titleForRowAtIndexPath(indexPath) },
            shouldCheckRowAtIndexPath: { [unowned self] indexPath in self.currentSettings.shouldCheckRowAtIndexPath(indexPath) },
            selectedRowsInSection: { [unowned self] section in self.currentSettings.selectedRowsInSection(section) },
            allowsMultipleSelectionClosure: { [unowned self] section in self.currentSettings.allowMultipleSelectionInSection(section) },
            changeSettingsClosure: { [unowned self] indexPath in self.currentSettings = self.currentSettings.refineSettingsWithSelectedIndexPath(indexPath) })

        let tableView = UITableView().then {
            $0.registerClass(RefinementOptionsTableViewCell.self, forCellReuseIdentifier: CellIdentifier)
            $0.scrollEnabled = false
            $0.separatorColor = .artsyGrayRegular()
            $0.separatorInset = UIEdgeInsetsZero
            $0.dataSource = tableViewHandler
            $0.delegate = tableViewHandler

            let tableViewHeight = 44 * currentSettings.numberOfRowsInSection(0) - 1 // -1 to cut off the bottom-most separator that we'll manually add below.
            $0.constrainHeight("\(tableViewHeight)")
        }
        stackView.addSubview(tableView, withTopMargin: "0", sideMargin: "40")

        stackView.addSubview(ARSeparatorView(), withTopMargin: "0", sideMargin: "0")

        // Price section
        if let initialRange = initialSettings.priceRange, maxRange = defaultSettings.priceRange where initialSettings.hasEstimates {
            stackView.addSubview(subtitleLabel("Price"), withTopMargin: "20", sideMargin: "40")

            let priceExplainLabel = ARSerifLabel().then {
                $0.font = UIFont.serifItalicFontWithSize(15)
                $0.text = "Based on the low estimates of the works"
            }
            stackView.addSubview(priceExplainLabel, withTopMargin: "10", sideMargin: "40")

            let labelContainer = UIView().then {
                $0.constrainHeight("20")
                $0.translatesAutoresizingMaskIntoConstraints = false
            }
            stackView.addSubview(labelContainer, withTopMargin: "10", sideMargin: "40")

            let slider = MARKRangeSlider().then {
                $0.rangeImage = UIImage(named: "Range")
                $0.trackImage = UIImage(named: "Track")
                $0.rightThumbImage = UIImage(named: "Thumb")
                $0.leftThumbImage = $0.rightThumbImage
                $0.addTarget(self, action: #selector(RefinementOptionsViewController.sliderValueDidChange(_:)), forControlEvents: .ValueChanged)

                $0.setMinValue(CGFloat(maxRange.min), maxValue: CGFloat(maxRange.max))
                $0.setLeftValue(CGFloat(initialRange.min), rightValue: CGFloat(initialRange.max))

                // Make sure they don't touch by keeping them minimum 10% apart
                $0.minimumDistance = CGFloat(maxRange.max - maxRange.min) / 10.0
            }
            stackView.addSubview(slider, withTopMargin: "10", sideMargin: "40")

            // Max/min labels
            let minLabel = ARItalicsSerifLabel().then {
                $0.font = UIFont.serifFontWithSize(15)
                return
            }
            labelContainer.addSubview(minLabel)

            minLabel.alignCenterYWithView(labelContainer, predicate: "0") // Center vertically in container.
            let labelPriority = SliderPriorities.StayCenteredOverThumb.rawValue
            minLabel.alignCenterXWithView(slider.leftThumbView, predicate: "0@\(labelPriority)")

            minLabel.alignAttribute(.Leading, toAttribute: .Leading, ofView: labelContainer, predicate: ">= 0@\(SliderPriorities.StayWithinFrame.rawValue)")

            let maxLabel = ARItalicsSerifLabel().then {
                $0.font = UIFont.serifFontWithSize(15)
                return
            }
            labelContainer.addSubview(maxLabel)

            maxLabel.alignCenterYWithView(labelContainer, predicate: "0") // Center vertically in container.
            maxLabel.alignCenterXWithView(slider.rightThumbView, predicate: "0@\(SliderPriorities.StayCenteredOverThumb.rawValue)")
            maxLabel.alignAttribute(.Trailing, toAttribute: .Trailing, ofView: labelContainer, predicate: "<= 0@\(SliderPriorities.StayWithinFrame.rawValue)")

            // Make sure they don't touch! Shouldn't be necessary since they'll be 10% appart, but this is "just in case" make sure the labels never overlap.
            minLabel.constrainTrailingSpaceToView(maxLabel, predicate: "<= -10@\(SliderPriorities.DoNotOverlap.rawValue)")

            self.minLabel = minLabel
            self.maxLabel = maxLabel
            self.slider = slider

            updatePriceLabels()
        }

        let applyButton = ARBlackFlatButton().then {
            $0.enabled = false
            $0.setTitle("Apply", forState: .Normal)
            $0.addTarget(self, action: #selector(RefinementOptionsViewController.userDidPressApply), forControlEvents: .TouchUpInside)
        }

        let resetButton = ARWhiteFlatButton().then {
            $0.enabled = false
            $0.setTitle("Reset", forState: .Normal)
            $0.setBorderColor(.artsyGrayRegular(), forState: .Normal)
            $0.setBorderColor(UIColor.artsyGrayRegular().colorWithAlphaComponent(0.5), forState: .Disabled)
            $0.layer.borderWidth = 1
            $0.addTarget(self, action: #selector(RefinementOptionsViewController.userDidPressReset), forControlEvents: .TouchUpInside)
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

        updateButtonEnabledStates()

        return stackView
    }
}

enum SliderPriorities: String {
    case StayWithinFrame = "475"
    case DoNotOverlap = "450"
    case StayCenteredOverThumb = "425"
}

class RefinementOptionsViewControllerTableViewHandler: NSObject, UITableViewDataSource, UITableViewDelegate  {
    let numberOfSections: Int
    let numberOfRowsInSection: Int -> Int
    let titleForRowAtIndexPath: NSIndexPath -> String
    let shouldCheckRowAtIndexPath: NSIndexPath -> Bool
    let selectedRowsInSection: Int -> [NSIndexPath]
    let allowsMultipleSelectionInSection: Int -> Bool
    let changeSettingsClosure: NSIndexPath -> Void

    // closures from currentSettings
    init(numberOfSections: Int, numberOfRowsInSection: Int -> Int, titleForRowAtIndexPath: NSIndexPath -> String, shouldCheckRowAtIndexPath: NSIndexPath -> Bool, selectedRowsInSection: Int -> [NSIndexPath], allowsMultipleSelectionClosure: Int -> Bool, changeSettingsClosure: NSIndexPath -> Void) {
        self.numberOfSections = numberOfSections
        self.numberOfRowsInSection = numberOfRowsInSection
        self.titleForRowAtIndexPath = titleForRowAtIndexPath
        self.shouldCheckRowAtIndexPath = shouldCheckRowAtIndexPath
        self.selectedRowsInSection = selectedRowsInSection
        self.allowsMultipleSelectionInSection = allowsMultipleSelectionClosure
        self.changeSettingsClosure = changeSettingsClosure

        super.init()
    }

    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return numberOfSections
    }


    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return numberOfRowsInSection(section)
    }

    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier(CellIdentifier, forIndexPath: indexPath)

        cell.textLabel?.text = titleForRowAtIndexPath(indexPath)

        return cell
    }

    func tableView(tableView: UITableView, willDisplayCell cell: UITableViewCell, forRowAtIndexPath indexPath: NSIndexPath) {
        cell.layoutMargins = UIEdgeInsetsZero
        cell.preservesSuperviewLayoutMargins = false
        cell.textLabel?.font = UIFont.serifFontWithSize(16)
        cell.checked = shouldCheckRowAtIndexPath(indexPath)
    }

    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        tableView.deselectRowAtIndexPath(indexPath, animated: true)
        
        let oldCheckedCellIndices = selectedRowsInSection(indexPath.section)

        if allowsMultipleSelectionInSection(indexPath.section) {
            fatalError("currently only supports single-selection")
        } else {
            // Un-check formerly selected cell.
            if let oldCheckedCellIndex = oldCheckedCellIndices.first {
                let formerlySelected = tableView.cellForRowAtIndexPath(oldCheckedCellIndex)
                formerlySelected?.checked = false
            }
            
            // Change setting.
            changeSettingsClosure(indexPath)
            
            // Check newly selected cell.
            let selectedCell = tableView.cellForRowAtIndexPath(indexPath)
            selectedCell?.checked = true
        }
    }
}

class RefinementOptionsTableViewCell: UITableViewCell {
    override func layoutSubviews() {
        super.layoutSubviews()
        textLabel?.frame.origin.x = 0
    }
}

private extension UITableViewCell {
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
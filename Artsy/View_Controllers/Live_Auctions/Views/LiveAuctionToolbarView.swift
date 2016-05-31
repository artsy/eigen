import UIKit
import Interstellar
import FLKAutoLayout

class LiveAuctionToolbarView : UIView {

    var lotViewModel: LiveAuctionLotViewModelType!
    var auctionViewModel: LiveAuctionViewModelType!

    var lotStateObserver: ObserverToken<LotState>?

    deinit {
        lotStateObserver?.unsubscribe()
    }

    override func traitCollectionDidChange(previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)
        setupViews()
    }

    func lotCountString() -> NSAttributedString {
        let lotString = NSMutableAttributedString(string: String(lotViewModel.lotIndex + 1), attributes:
            [NSForegroundColorAttributeName: UIColor.artsyPurpleRegular()]
        )
        let countString = NSMutableAttributedString(string: "/\(auctionViewModel.lotCount)", attributes: [:])

        lotString.appendAttributedString(countString)
        return lotString
    }

    func attributify(string: String, color: UIColor = .blackColor()) -> NSAttributedString {
        return NSAttributedString(string: string.uppercaseString, attributes: [NSForegroundColorAttributeName: color])
    }

    func setupViews() {
        lotStateObserver = lotViewModel.lotStateSignal.subscribe { [weak self] lotState in
            self?.timeSinceLotOpenedTimer?.invalidate()
            self?.subviews.forEach { $0.removeFromSuperview() }
            self?.setupUsingState(lotState)
        }
    }

    // during a live lot we need to keep a reference to the timer
    var timeSinceLotOpenedTimer: NSTimer?
    var timeSinceLotOpenedLabel: UILabel?

    func setupUsingState(lotState: LotState) {
        let viewStructure: [[String: NSAttributedString]]
        var clockClosure: ((UILabel) -> ())?

        switch lotState {

        case .ClosedLot:
            viewStructure = [
                ["lot": lotCountString()],
                ["time": attributify("Closed", color: .auctionRed())],
            ]

        case .LiveLot:
            viewStructure = [
                ["lot": lotCountString()],
                ["time": attributify("--:--")],
                ["watchers": attributify("09")],
                ["bidders": attributify(String(lotViewModel.numberOfBids))]
            ]


            clockClosure = { [unowned self] label in
                self.formatter.dateFormat = "mm:ss"
                self.timeSinceLotOpenedLabel = label
                self.timeSinceLotOpenedTimer =  NSTimer.scheduledTimerWithTimeInterval(0.9, target: self, selector: #selector(self.updateTimerLabel), userInfo: nil, repeats: true)
                self.updateTimerLabel(self.timeSinceLotOpenedTimer!)
            }

        case .UpcomingLot:
            let lotString: String
            if let distance = auctionViewModel.distanceFromCurrentLot(lotViewModel) {
                let lots = distance == 1 ? "lot" : "lots"
                lotString = "\(distance) \(lots) away"
            } else {
                lotString = "Upcoming"
            }

            viewStructure = [
                ["lot": lotCountString()],
                ["time": attributify(lotString, color: .artsyPurpleRegular())],
                ["watchers": attributify("09")],
                ["bidders": attributify(String(lotViewModel.numberOfBids))]
            ]
        }

        let views:[UIView] = viewStructure.map { dict in
            let key = dict.keys.first!
            let thumbnail = UIImage(named: "lot_\(key)_info")

            let view = UIView()
            let thumbnailView = UIImageView(image: thumbnail)
            view.addSubview(thumbnailView)

            let label = ARSansSerifLabel()
            label.font = UIFont.sansSerifFontWithSize(12)
            view.addSubview(label)

            label.attributedText = dict.values.first!

            if key == "time" && clockClosure != nil {
                clockClosure?(label)
            }

            view.constrainHeight("14")
            thumbnailView.alignLeadingEdgeWithView(view, predicate: "0")
            thumbnailView.alignCenterYWithView(view, predicate: "0")
            label.alignTrailingEdgeWithView(view, predicate: "0")
            label.alignCenterYWithView(view, predicate: "0")
            thumbnailView.constrainTrailingSpaceToView(label, predicate:"-6")
            return view
        }

        views.forEach { button in
            self.addSubview(button)
            button.alignCenterYWithView(self, predicate: "0")
        }

        let first = views.first!
        let last = views.last!

        first.alignLeadingEdgeWithView(self, predicate: "0")
        last.alignTrailingEdgeWithView(self, predicate: "0")

        if views.count == 3 {
            let middle = views[1]
            middle.alignCenterXWithView(self, predicate: "0")
        }

        if views.count == 4 {
            let middleLeft = views[1]
            let middleRight = views[2]

            let spacerView = UIView()
            addSubview(spacerView)

            let spacerView2 = UIView()
            addSubview(spacerView2)

            let spacerView3 = UIView()
            addSubview(spacerView3)

            UIView.equalWidthForViews([spacerView, spacerView2, spacerView3])

            spacerView.alignAttribute(.Leading, toAttribute: .Trailing, ofView: first, predicate: "0")
            spacerView.alignAttribute(.Trailing, toAttribute: .Leading, ofView: middleLeft, predicate: "0")

            spacerView2.alignAttribute(.Leading, toAttribute: .Trailing, ofView: middleLeft, predicate: "0")
            spacerView2.alignAttribute(.Trailing, toAttribute: .Leading, ofView: middleRight, predicate: "0")
            
            spacerView3.alignAttribute(.Leading, toAttribute: .Trailing, ofView: middleRight, predicate: "0")
            spacerView3.alignAttribute(.Trailing, toAttribute: .Leading, ofView: last, predicate: "0")
        }
    }

    private lazy var formatter = NSDateFormatter()

    func updateTimerLabel(timer: NSTimer) {
        guard let startDate = lotViewModel.dateLotOpened else { return }
        let now = NSDate().timeIntervalSinceReferenceDate
        let date = NSDate(timeIntervalSinceReferenceDate: now - startDate.timeIntervalSinceReferenceDate)
        timeSinceLotOpenedLabel?.text = formatter.stringFromDate(date)
    }
}

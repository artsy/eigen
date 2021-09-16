import UIKit
import Interstellar

class LiveAuctionToolbarView: UIView {

    fileprivate enum Views: String {
        case lot, time, bidders
    }

    var lotViewModel: LiveAuctionLotViewModelType!
    var auctionViewModel: LiveAuctionViewModelType!

    var lotStateObserver: ObserverToken<LotState>?
    var numberOfBidsObserver: ObserverToken<Int>?

    init(lotViewModel: LiveAuctionLotViewModelType, auctionViewModel: LiveAuctionViewModelType) {
        super.init(frame: CGRect.zero)
        self.lotViewModel = lotViewModel
        self.auctionViewModel = auctionViewModel
        self.setupViews()
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)
        setupViews()
    }

    func lotNumberString() -> NSAttributedString {
        guard let lotLabel = lotViewModel.lotLabel else { return NSAttributedString() }
        return NSAttributedString(string: lotLabel, attributes: [:])
    }

    func attributify(_ string: String, color: UIColor = .black) -> NSAttributedString {
        return NSAttributedString(string: string.uppercased(), attributes: [NSAttributedString.Key.foregroundColor: color])
    }

    func setupViews() {
        lotStateObserver = lotViewModel.lotStateSignal.subscribe { [weak self] lotState in
            guard let sSelf = self else { return }
            sSelf.timeSinceLotOpenedTimer?.invalidate()
            sSelf.subviews.forEach { $0.removeFromSuperview() }
            sSelf.setupUsingState(lotState)
        }
    }

    override func willMove(toSuperview newSuperview: UIView?) {
        super.willMove(toSuperview: newSuperview)

        if newSuperview == nil {
            lotStateObserver?.unsubscribe()
            numberOfBidsObserver?.unsubscribe()
        }
    }

    // during a live lot we need to keep a reference to the timer
    var timeSinceLotOpenedTimer: Timer?
    var timeSinceLotOpenedLabel: UILabel?

    func setupUsingState(_ lotState: LotState) {
        let viewStructure: [[Views: NSAttributedString]]
        var clockClosure: ((UILabel) -> ())?
        var numberOfBidsClosure: ((UILabel) -> Void)?

        switch lotState {

        case .closedLot:
            viewStructure = [
                [.lot: lotNumberString()],
                [.time: attributify("Closed", color: .auctionRed())],
            ]

        case .liveLot:
            viewStructure = [
                [.lot: lotNumberString()],
                [.time: attributify("--:--")],
                [.bidders: attributify(String(lotViewModel.numberOfBids))]
            ]

            numberOfBidsClosure = { [weak self] label in
                guard let `self` = self else { return }
                guard self.numberOfBidsObserver == nil else { return }

                self.numberOfBidsObserver = self.lotViewModel
                    .numberOfBidsSignal
                    .subscribe { [weak self] numberOfBids in
                        label.attributedText = self?.attributify(String(numberOfBids)) ?? NSAttributedString()
                }
            }

            clockClosure = { label in
                self.formatter.dateFormat = "mm:ss"
                self.timeSinceLotOpenedLabel = label
                self.timeSinceLotOpenedTimer = Timer.scheduledTimer(timeInterval: 0.9, target: self, selector: #selector(self.updateTimerLabel), userInfo: nil, repeats: true)
                if let timeSinceLotOpenedTimer = self.timeSinceLotOpenedTimer {
                    self.updateTimerLabel(timeSinceLotOpenedTimer)
                }
            }

        case .upcomingLot:
            let lotString: String
            if let distance = auctionViewModel.distanceFromCurrentLot(lotViewModel), distance > 0 {
                let lots = distance == 1 ? "lot" : "lots"
                lotString = "\(distance) \(lots) away"
            } else {
                lotString = "Upcoming"
            }

            viewStructure = [
                [.lot: lotNumberString()],
                [.time: attributify(lotString, color: .artsyPurpleRegular())],
                [.bidders: attributify(String(lotViewModel.numberOfBids))]
            ]
        }

        // swiftlint:disable force_unwrapping
        let views: [UIView] = viewStructure.map { dict in
            let key = dict.keys.first!
            let thumbnail = UIImage(named: "lot_\(key.rawValue)_info")

            let view = UIView()
            let thumbnailView = UIImageView(image: thumbnail)
            view.addSubview(thumbnailView)

            let label = ARSansSerifLabel()
            label.font = UIFont.sansSerifFont(withSize: 12)
            view.addSubview(label)

            label.attributedText = dict.values.first!

            if key == .time {
                clockClosure?(label)
            }

            if key == .bidders {
                numberOfBidsClosure?(label)
            }

            view.constrainHeight("14")
            thumbnailView.alignLeadingEdge(withView: view, predicate: "0")
            thumbnailView.alignCenterY(withView: view, predicate: "0")
            label.alignTrailingEdge(withView: view, predicate: "0")
            label.alignCenterY(withView: view, predicate: "0")
            thumbnailView.constrainTrailingSpace(toView: label, predicate:"-6")
            return view
        }

        views.forEach { button in
            self.addSubview(button)
            button.alignCenterY(withView: self, predicate: "0")
        }

        let first = views.first!
        let last = views.last!

        first.alignLeadingEdge(withView: self, predicate: "0")
        last.alignTrailingEdge(withView: self, predicate: "0")

        if views.count == 3 {
            let middle = views[1]
            middle.alignCenterX(withView: self, predicate: "0")
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

            UIView.equalWidth(for: [spacerView, spacerView2, spacerView3])

            spacerView.alignAttribute(.leading, to: .trailing, ofView: first, predicate: "0")
            spacerView.alignAttribute(.trailing, to: .leading, ofView: middleLeft, predicate: "0")

            spacerView2.alignAttribute(.leading, to: .trailing, ofView: middleLeft, predicate: "0")
            spacerView2.alignAttribute(.trailing, to: .leading, ofView: middleRight, predicate: "0")

            spacerView3.alignAttribute(.leading, to: .trailing, ofView: middleRight, predicate: "0")
            spacerView3.alignAttribute(.trailing, to: .leading, ofView: last, predicate: "0")
        }

        // swiftlint:enable force_unwrapping
    }

    fileprivate lazy var formatter = DateFormatter()

    @objc func updateTimerLabel(_ timer: Timer) {
        guard let startDate = lotViewModel.dateLotOpened else { return }
        let now = Date().timeIntervalSinceReferenceDate
        let date = Date(timeIntervalSinceReferenceDate: now - startDate.timeIntervalSinceReferenceDate)
        timeSinceLotOpenedLabel?.text = formatter.string(from: date)
    }
}

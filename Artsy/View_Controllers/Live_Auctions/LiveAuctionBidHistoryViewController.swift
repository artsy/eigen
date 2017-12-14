import UIKit
import Interstellar

class LiveAuctionHistoryCell: UITableViewCell {

    override init(style: UITableViewCellStyle, reuseIdentifier: String?) {
        super.init(style: .value1, reuseIdentifier: reuseIdentifier)
        backgroundColor = .white

        textLabel?.font = .sansSerifFont(withSize: 14)
        detailTextLabel?.font = .sansSerifFont(withSize: 14)
    }

    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    func updateWithEventViewModel(_ event: LiveAuctionEventViewModel) {
        self.textLabel?.attributedText = event.eventTitle
        self.detailTextLabel?.attributedText = event.eventSubtitle
    }
}


class LiveAuctionBidHistoryViewController: UITableViewController {

    let lotViewModel: LiveAuctionLotViewModelType
    var newEventsSubscription: ObserverToken<[LiveAuctionEventViewModel]>!

    init(lotViewModel: LiveAuctionLotViewModelType) {
        self.lotViewModel = lotViewModel

        super.init(nibName: nil, bundle: nil)

        tableView.allowsSelection = false
        tableView.showsVerticalScrollIndicator = false
        tableView.separatorColor = .clear

        newEventsSubscription = lotViewModel.newEventsSignal.subscribe { [weak self] newEvents in
            // We want to skip any initial first values that are cached by the observables, we can do this by making sure we have a window (since cached values are immediately sent, before the initializer is completed).
            guard let _ = self?.view.window else { return }
            guard let `self` = self else { return }

            self.tableView.reloadData()

            // Support haptic feedback during an auction
            self.provideHapticFeedbackForEvents(events: newEvents)

            //
//            let currentCellCount = self.tableView.numberOfRowsInSection(0)
//            guard newEvents.reloadCondition(currentCellCount, lotViewModel: self.lotViewModel) == .Update else {
//                return self.tableView.reloadData()
//            }
//
//            let newIndexPaths = newEvents.enumerate().map { (index, _) -> NSIndexPath in
//                return NSIndexPath(forRow: index, inSection: 0)
//            }
//
//            self.tableView.insertRowsAtIndexPaths(newIndexPaths, withRowAnimation: self.appDependentRowAnimationStyle)
        }
    }

    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    deinit {
        newEventsSubscription.unsubscribe()
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)

        // We may be _re_appearing, so scroll to top if we have any cells.
        if lotViewModel.numberOfDerivedEvents > 0 {
//            tableView.scrollToRowAtIndexPath(NSIndexPath(forRow: 0, inSection: 0), atScrollPosition: .Top, animated: false)
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.register(LiveAuctionHistoryCell.self, forCellReuseIdentifier: "live")
        tableView.backgroundColor = .clear
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return lotViewModel.numberOfDerivedEvents
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        return tableView.dequeueReusableCell(withIdentifier: "live", for: indexPath)
    }

    override func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {
        guard let cell = cell as? LiveAuctionHistoryCell else { return }

        let event = lotViewModel.derivedEventAtPresentationIndex(indexPath.row)
        cell.updateWithEventViewModel(event)
        cell.drawBottomDottedBorder(with: UIColor.artsyGrayMedium())
    }

    func provideHapticFeedbackForEvents(events: [LiveAuctionEventViewModel]) {
        if #available(iOS 10.0, *) {
            var feedbackWeight: UIImpactFeedbackStyle? = nil
            events.forEach { event in
                if event.isBid && feedbackWeight == nil {
                    feedbackWeight = .light
                }
                if event.isFairWarning {
                    feedbackWeight = .medium
                }
                if event.isFinalCall {
                    feedbackWeight = .heavy
                }
            }

            guard let feedbackStyle = feedbackWeight else { return }
            let feedback = UIImpactFeedbackGenerator(style: feedbackStyle)
            feedback.impactOccurred()
        }
    }
}


enum TableViewUpdateCondition {
    case reload
    case update
}

extension Array where Element: LiveAuctionEventViewModelType {

    // If an event was removed from the derived list (maybe it was cancelled) then we can't rely
    // on insertRowsAtIndexPaths(), we need to reload. Alternatively, sending in _empty_
    // new events indicates that a previously user-facing event has been modified.
    func reloadCondition(_ currentlyDisplayedCellCount: Int, lotViewModel: LiveAuctionLotViewModelType) -> TableViewUpdateCondition {
        if isEmpty { return .reload }
        if currentlyDisplayedCellCount + count != lotViewModel.numberOfDerivedEvents { return .reload }
        return .update
    }
}

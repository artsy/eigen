import UIKit
import Interstellar


class LiveAuctionHistoryCell: UITableViewCell {

    override init(style: UITableViewCellStyle, reuseIdentifier: String?) {
        super.init(style: .Value1, reuseIdentifier: reuseIdentifier)
        backgroundColor = .whiteColor()
        drawBottomDottedBorder()

        textLabel?.font = .sansSerifFontWithSize(14)
        detailTextLabel?.font = .sansSerifFontWithSize(14)
    }

    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    func updateWithEventViewModel(event: LiveAuctionEventViewModel) {
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

        newEventsSubscription = lotViewModel.newEventsSignal.subscribe { [weak self] newEvents in
            // We want to skip any initial first values that are cached by the observables, we can do this by making sure we have a window (since cached values are immediately sent, before the initializer is completed).
            guard let _ = self?.view.window else { return }
            guard let `self` = self else { return }

            self.tableView.reloadData()
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

    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)

        // We may be _re_appearing, so scroll to top if we have any cells.
        if lotViewModel.numberOfDerivedEvents > 0 {
//            tableView.scrollToRowAtIndexPath(NSIndexPath(forRow: 0, inSection: 0), atScrollPosition: .Top, animated: false)
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.registerClass(LiveAuctionHistoryCell.self, forCellReuseIdentifier: "live")
        tableView.backgroundColor = .clearColor()
    }

    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return lotViewModel.numberOfDerivedEvents
    }

    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        return tableView.dequeueReusableCellWithIdentifier("live", forIndexPath: indexPath)
    }

    override func tableView(tableView: UITableView, willDisplayCell cell: UITableViewCell, forRowAtIndexPath indexPath: NSIndexPath) {
        guard let cell = cell as? LiveAuctionHistoryCell else { return }

        let event = lotViewModel.derivedEventAtPresentationIndex(indexPath.row)
        cell.updateWithEventViewModel(event)
    }
}


enum TableViewUpdateCondition {
    case Reload
    case Update
}

extension Array where Element: LiveAuctionEventViewModelType {

    // If an event was removed from the derived list (maybe it was cancelled) then we can't rely
    // on insertRowsAtIndexPaths(), we need to reload. Alternatively, sending in _empty_
    // new events indicates that a previously user-facing event has been modified.
    func reloadCondition(currentlyDisplayedCellCount: Int, lotViewModel: LiveAuctionLotViewModelType) -> TableViewUpdateCondition {
        if isEmpty { return .Reload }
        if currentlyDisplayedCellCount + count != lotViewModel.numberOfDerivedEvents { return .Reload }
        return .Update
    }
}

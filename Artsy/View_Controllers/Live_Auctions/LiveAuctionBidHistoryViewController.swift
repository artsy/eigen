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
    var nextInsertIndex = 0

    var newEventsBeganSubscription: ObserverToken<NSDate>!
    var newEventsEndedSubscription: ObserverToken<NSDate>!
    var newEventsSubscription: ObserverToken<LiveAuctionEventViewModel>!

    init(lotViewModel: LiveAuctionLotViewModelType) {
        self.lotViewModel = lotViewModel

        super.init(style: .Plain)

        tableView.allowsSelection = false
        tableView.showsVerticalScrollIndicator = false
//
//        newEventsBeganSubscription = lotViewModel.startEventUpdatesSignal.subscribe { [weak self] _ in
//            // We want to skip any initial first values that are cached by the observables, we can do this by making sure we have a window (since cached values are immediately sent, before the initializer is completed).
//            guard let _ = self?.view.window else { return }
//
//            self?.nextInsertIndex = 0
//            self?.tableView.beginUpdates()
//        }
//
//        newEventsEndedSubscription = lotViewModel.endEventUpdatesSignal.subscribe { [weak self] _ in
//            // We comment in startEventUpdatesSignal subscription.
//            guard let _ = self?.view.window else { return }
//
//            self?.tableView.endUpdates()
//        }
//
//        newEventsSubscription = lotViewModel.newEventSignal.subscribe { [weak self] event in
//            // We comment in startEventUpdatesSignal subscription.
//            guard let _ = self?.view.window else { return }
//
//            let indexPath = NSIndexPath(forRow: self?.nextInsertIndex ?? 0, inSection: 0)
//            self?.tableView.insertRowsAtIndexPaths([indexPath], withRowAnimation: .Automatic)
//            self?.nextInsertIndex += 1
//        }

        newEventsEndedSubscription = lotViewModel.endEventUpdatesSignal.subscribe { [weak self] _ in
        }

        newEventsSubscription = lotViewModel.newEventSignal.subscribe { [weak self] event in
        }

        newEventsEndedSubscription = lotViewModel.endEventUpdatesSignal.subscribe { [weak self] _ in
            // We comment in startEventUpdatesSignal subscription.
            guard let _ = self?.view.window else { return }

            self?.tableView.reloadData()
        }

    }

    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    deinit {
        newEventsBeganSubscription.unsubscribe()
        newEventsEndedSubscription.unsubscribe()
        newEventsSubscription.unsubscribe()
    }

    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)

        // We may be _re_appearing, so scroll to top if we have any cells.
        if lotViewModel.numberOfDerivedEvents > 0 {
            tableView.scrollToRowAtIndexPath(NSIndexPath(forRow: 0, inSection: 0), atScrollPosition: .Top, animated: false)
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

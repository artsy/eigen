import UIKit

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

    var lotViewModel: LiveAuctionLotViewModelType? {
        didSet {
            tableView.reloadData()
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.registerClass(LiveAuctionHistoryCell.self, forCellReuseIdentifier: "live")
    }

    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return lotViewModel?.numberOfEvents ?? 0
    }

    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        return tableView.dequeueReusableCellWithIdentifier("live")!
    }

    override func tableView(tableView: UITableView, willDisplayCell cell: UITableViewCell, forRowAtIndexPath indexPath: NSIndexPath) {
        guard let lotViewModel = lotViewModel else { return }
        guard let cell = cell as? LiveAuctionHistoryCell else { return }

        // Events are ordered FIFO, need to inverse for presentation
        let total = self.tableView(tableView, numberOfRowsInSection: 0) - 1
        let event = lotViewModel.eventAtIndex(total - indexPath.row)
        cell.updateWithEventViewModel(event)
    }
}

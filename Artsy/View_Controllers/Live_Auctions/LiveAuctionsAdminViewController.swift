import UIKit

/// Shouldn't be accessible for people outside of Artsy

class LiveAuctionsAdminViewController: UIViewController {

    let salesPerson: LiveAuctionsSalesPersonType
    var textView: UITextView?
    var rawEvents = LotEventJSON()

    init(salesPerson: LiveAuctionsSalesPersonType) {
        self.salesPerson = salesPerson

        super.init(nibName: nil, bundle: nil)
        self.title = "[Live] Admin Interface"
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        let text = UITextView()
        text.font = UIFont(name: "Menlo-Regular", size: 14)
        text.editable = false

        view.addSubview(text)
        text.alignToView(view)
        textView = text

        let image = UIImage(named: "navigation_more_arrow_vertical@2x")
        let button = ARSerifToolbarButtonItem(image: image)
        button.button.addTarget(self, action: #selector(scrolltoBottom), forControlEvents: .TouchUpInside)
        self.navigationItem.rightBarButtonItems = [button]

        salesPerson.debugAllEventsSignal.subscribe { events in
            self.rawEvents.appendContentsOf(events.reverse())
            self.reloadData()
        }
    }

    func scrolltoBottom() {
        guard let textView = textView else { return }
        textView.scrollRangeToVisible(NSRange(location: textView.text.characters.count - 2, length: 1))
    }

    func reloadData() {
        var texts = [String]()
        switch salesPerson.bidderStatus {
        case .NotLoggedIn:
            texts.append("Bidder Status: Not Logged In")
        case .NotRegistered:
            texts.append("Bidder Status: Not registered for sale")
        case .Registered:
            texts.append("Bidder Status: Registered for sale")
        }

        texts.append("\n ---- EVENTS\n")
        for event in rawEvents {
            texts.append("\(event.debugDescription)\n\n")
        }

        guard let textView = textView else { return }
        textView.text = texts.joinWithSeparator("\n")
    }
}

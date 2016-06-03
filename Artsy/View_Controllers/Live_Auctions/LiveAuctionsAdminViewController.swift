import UIKit

/// Shouldn't be accessible for people outside of Artsy

class LiveAuctionsAdminViewController: UIViewController {

    let salesPerson: LiveAuctionsSalesPersonType
    var textView: UITextView?
    var rawEvents = [LiveEvent]()

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
        text.font = UIFont(name: "Menlo-Regular=", size: 14)
        text.editable = false
        view.addSubview(text)
        text.alignToView(view)
        textView = text

        salesPerson.debugAllEventsSignal.subscribe { events in
            self.rawEvents.appendContentsOf(events)
            self.reloadData()
        }
    }

    func reloadData() {
        var texts = [String]()
        texts.append("Bidder Status: \(salesPerson.bidderStatus)")

        for event in rawEvents {
            texts.append("\(event.debugDescription)")
        }

        guard let textView = textView else { return }
        textView.text = texts.joinWithSeparator("\n")
    }
}

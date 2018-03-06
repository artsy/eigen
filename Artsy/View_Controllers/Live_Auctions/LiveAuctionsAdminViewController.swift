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
        text.isEditable = false

        view.addSubview(text)
        text.align(toView: view)
        textView = text

        let image = UIImage(named: "navigation_more_arrow_vertical@2x")
        let button = ARSerifToolbarButtonItem(image: image)
        button?.button.addTarget(self, action: #selector(scrolltoBottom), for: .touchUpInside)
        self.navigationItem.rightBarButtonItems = [button!]

        salesPerson.debugAllEventsSignal.subscribe { events in
            self.rawEvents.append(contentsOf: events.reversed())
            self.reloadData()
        }
    }

    @objc func scrolltoBottom() {
        guard let textView = textView else { return }
        textView.scrollRangeToVisible(NSRange(location: textView.text.count - 2, length: 1))
    }

    func reloadData() {
        var texts = [String]()

        switch salesPerson.auctionViewModel.auctionState {
        case ARAuctionState.userPendingRegistration:
            texts.append("Bidder Status: Registration pending")
        case ARAuctionState.userIsRegistered:
            texts.append("Bidder Status: Registered for sale")
        default:
            texts.append("Bidder Status: Not registered for sale")
        }

        texts.append("\n ---- EVENTS\n")
        for event in rawEvents {
            texts.append("\(event.debugDescription)\n\n")
        }

        guard let textView = textView else { return }
        textView.text = texts.joined(separator: "\n")
    }
}

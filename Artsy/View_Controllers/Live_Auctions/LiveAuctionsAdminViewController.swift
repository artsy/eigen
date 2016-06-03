import UIKit

/// Shouldn't be accessible for people outside of Artsy

class LiveAuctionsAdminViewController: UIViewController {

    let viewModel: LiveAuctionLotViewModel
    var textView: UITextView?

    init(viewModel: LiveAuctionLotViewModel) {
        self.viewModel = viewModel

        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        let text = UITextView()
        view.addSubview(text)
        text.alignToView(view)
        textView = text

        viewModel.endEventUpdatesSignal.subscribe { _ in
            self.reloadData()
            return
        }
    }

    func reloadData() {
        var text = "Events: "
        for index in 0 ..< viewModel.numberOfEvents {
            let event = viewModel.eventAtIndex(index)
            text += "\(event.event.debugDescription)\n"
        }
    }
}

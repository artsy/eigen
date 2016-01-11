import UIKit

class AuctionViewController: UIViewController {
    let saleID: String

    lazy var networkModel: AuctionNetworkModel = {
        return AuctionNetworkModel(saleID: self.saleID)
    }()

    init(saleID: String) {
        self.saleID = saleID

        super.init(nibName: nil, bundle: nil)
    }

    // Required by Swift compiler, sadly.
    required init?(coder aDecoder: NSCoder) {
        self.saleID = ""
        super.init(coder: aDecoder)
        return nil
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        view.backgroundColor = .whiteColor()
    }

    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)

        ar_presentIndeterminateLoadingIndicatorAnimated(animated)
        networkModel.fetchSale { result in
            self.ar_removeIndeterminateLoadingIndicatorAnimated(animated)

            print(result)
        }
    }
}

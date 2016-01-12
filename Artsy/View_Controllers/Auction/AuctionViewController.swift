import UIKit
import ORStackView

class AuctionViewController: UIViewController {
    let saleID: String
    var saleViewModel: SaleViewModel?

    var stackScrollView: ORStackScrollView!

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

    override func loadView() {
        super.loadView()
        stackScrollView = setupTaggedStackView()
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

            switch result {
            case .Success(let saleViewModel):
                self.setupForSale(saleViewModel)
            case .Failure(_):
                break // TODO: How to handle error?
            }
        }
    }

    enum ViewTags: Int {
        case Banner = 0, Title
        
        case WhitespaceGobbler
    }
}

extension AuctionViewController {
    func setupForSale(saleViewModel: SaleViewModel) {
        self.saleViewModel = saleViewModel

        [ (AuctionBannerView(viewModel: saleViewModel), ViewTags.Banner),
          (AuctionTitleView(viewModel: saleViewModel), .Title),
          (ARWhitespaceGobbler(), .WhitespaceGobbler)
        ].forEach { (view, tag) in
            view.tag = tag.rawValue
            self.stackScrollView.stackView.addSubview(view, withTopMargin: "0")
        }
    }
}

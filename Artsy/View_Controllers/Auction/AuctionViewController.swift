import UIKit
import ORStackView

class AuctionViewController: UIViewController {
    let saleID: String
    var saleViewModel: SaleViewModel?
    var appeared = false

    var stackScrollView: ORStackScrollView!

    var refineSettings = AuctionRefineSettings(ordering: AuctionOrderingSwitchValue.LotNumber) {
        didSet {
            // TODO: Apply settings
        }
    }

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

        guard appeared == false else { return }
        appeared = true

        self.ar_presentIndeterminateLoadingIndicatorAnimated(animated)
        self.networkModel.fetchSale { result in
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
          (AuctionTitleView(viewModel: saleViewModel, delegate: self), .Title),
          (ARWhitespaceGobbler(), .WhitespaceGobbler)
        ].forEach { (view, tag) in
            view.tag = tag.rawValue
            self.stackScrollView.stackView.addSubview(view, withTopMargin: "0", sideMargin: "0")
        }
    }
}

extension AuctionViewController: AuctionTitleViewDelegate {
    func buttonPressed() {
        let refineViewController = AuctionRefineViewController()
        refineViewController.delegate = self
        refineViewController.initialSettings = refineSettings
        refineViewController.modalPresentationStyle = .FormSheet
        presentViewController(refineViewController, animated: true, completion: nil)
    }
}

extension AuctionViewController: AuctionRefineViewControllerDelegate {
    func userDidCancel(controller: AuctionRefineViewController) {
        dismissViewControllerAnimated(true, completion: nil)
    }

    func userDidApply(settings: AuctionRefineSettings, controller: AuctionRefineViewController) {
        refineSettings = settings
        dismissViewControllerAnimated(true, completion: nil)
    }
}
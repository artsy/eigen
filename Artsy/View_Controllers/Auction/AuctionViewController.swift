import UIKit
import ORStackView
import Then

class AuctionViewController: UIViewController {
    let saleID: String
    var saleViewModel: SaleViewModel?
    var appeared = false

    var headerStack: ORStackView!

    var geneNetworkModel: ARGeneArtworksNetworkModel!
    var _defaultRefineSettings: AuctionRefineSettings!
    private var artworksViewController: ARModelInfiniteScrollViewController!

    // Our refine settings are (by defualt) the default refine setings.
    lazy var refineSettings: AuctionRefineSettings = {
        return self.defaultRefineSettings()
    }()

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

        let gene = Gene(geneID: "humor")
        geneNetworkModel = ARGeneArtworksNetworkModel(gene: gene)

        headerStack = ORTagBasedAutoStackView()
        artworksViewController = ARModelInfiniteScrollViewController()
        ar_addAlignedModernChildViewController(artworksViewController)

        artworksViewController.headerStackView = headerStack
        artworksViewController.modelViewController.delegate = self

        getNextGenes()
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

        // TODO: Sale is currently private on the SVM
        // artworksViewController.spotlightEntity = saleViewModel.sale

        self.saleViewModel = saleViewModel

        [ (AuctionBannerView(viewModel: saleViewModel), ViewTags.Banner),
          (AuctionTitleView(viewModel: saleViewModel, delegate: self), .Title),
          (ARWhitespaceGobbler(), .WhitespaceGobbler)
        ].forEach { (view, tag) in
            view.tag = tag.rawValue
            headerStack.addSubview(view, withTopMargin: "0", sideMargin: "0")
        }
        artworksViewController.invalidateHeaderHeight()
    }

    func defaultRefineSettings() -> AuctionRefineSettings {
        guard let defaultSettings = _defaultRefineSettings else {
            // TODO: calculate min/max based on sale artworks. We're just using 100/100,000 for now.
            let defaultSettings = AuctionRefineSettings(ordering: AuctionOrderingSwitchValue.LotNumber, range: (min: 100, max: 100_000))
            _defaultRefineSettings = defaultSettings
            return defaultSettings
        }
        return defaultSettings
    }

    func generateStickyHeader() -> UIView {
        let header = UIView()

        let button = UIButton(type: .System)
        button.setTitle("Refine", forState: .Normal)
        button.addTarget(self, action: "buttonPressed", forControlEvents: .TouchUpInside)

        header.addSubview(button)
        button.alignTop("0", bottom: "0", toView: header)
        button.alignTrailingEdgeWithView(header, predicate: "10")

        let title = ARSerig

        return header
    }
}

extension AuctionViewController: AuctionTitleViewDelegate {
    func buttonPressed() {
        let refineViewController = AuctionRefineViewController(defaultSettings: defaultRefineSettings(), initialSettings: refineSettings).then {
            $0.delegate = self
            $0.modalPresentationStyle = .FormSheet
            $0.changeStatusBar = self.traitCollection.horizontalSizeClass == .Compact
        }
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

extension AuctionViewController: AREmbeddedModelsViewControllerDelegate {
    func embeddedModelsViewController(controller: AREmbeddedModelsViewController!, didTapItemAtIndex index: UInt) {
        // TODO
    }

    func embeddedModelsViewController(controller: AREmbeddedModelsViewController!, shouldPresentViewController viewController: UIViewController!) {
        navigationController?.pushViewController(viewController, animated: true)
    }

    func getNextGenes() {
        geneNetworkModel.getNextArtworkPage { artworks in
            self.artworksViewController.modelViewController.appendItems(artworks)
            self.artworksViewController.modelViewController.showTrailingLoadingIndicator = (artworks.count != 0)
        }
    }

    func embeddedModelsViewControllerDidScrollPastEdge(controller: AREmbeddedModelsViewController!) {
        getNextGenes()
    }
}
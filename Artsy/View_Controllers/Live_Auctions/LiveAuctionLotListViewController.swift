import UIKit
import Interstellar


protocol LiveAuctionLotListViewControllerDelegate: class {
    func didSelectLotAtIndex(_ index: Int, forLotListViewController lotListViewController: LiveAuctionLotListViewController)
}

class LiveAuctionLotListViewController: UICollectionViewController {
    let salesPerson: LiveAuctionsSalesPersonType
    let currentLotSignal: Observable<LiveAuctionLotViewModelType?>
    let stickyCollectionViewLayout: LiveAuctionLotListStickyCellCollectionViewLayout
    let auctionViewModel: LiveAuctionViewModelType

    var currentLotStateSubscription: ObserverToken<LotState>?

    var selectedIndex: Int? = 0 {
        didSet {
            if let selectedIndex = selectedIndex {
                let path = IndexPath(row: selectedIndex, section: 0)
                collectionView?.selectItem(at: path, animated: false, scrollPosition: UICollectionViewScrollPosition())
            }
        }
    }

    weak var delegate: LiveAuctionLotListViewControllerDelegate?

    fileprivate var currentLotSignalObserver: ObserverToken<LiveAuctionLotViewModelType?>!
    fileprivate var saleIsOnHold = false
    fileprivate let saleStatusView = SaleStatusView()

    init(salesPerson: LiveAuctionsSalesPersonType, currentLotSignal: Observable<LiveAuctionLotViewModelType?>, auctionViewModel: LiveAuctionViewModelType) {
        self.salesPerson = salesPerson
        self.currentLotSignal = currentLotSignal
        self.stickyCollectionViewLayout = LiveAuctionLotListStickyCellCollectionViewLayout()
        self.auctionViewModel = auctionViewModel

        super.init(collectionViewLayout: self.stickyCollectionViewLayout)

        currentLotSignalObserver = currentLotSignal.subscribe { [weak self] lot in
            guard let sSelf = self else { return }

            sSelf.unsubscribeCurrentLotState()

            guard let lot = lot else {
                return sSelf.stickyCollectionViewLayout.setActiveIndex(nil)
            }

            sSelf.unsubscribeCurrentLotState()

            // A lot can be the _current_ lot without being _opened_ yet. We check the current lot state to make sure that the activeIndex of the layout corresponds to the lotState that the cells are using to render themselves.
            sSelf.currentLotStateSubscription = lot.lotStateSignal.subscribe { lotState in
                let activeIndex: Int? = (lotState == .liveLot ? sSelf.salesPerson.indexForViewModel(lot) : nil)
                self?.stickyCollectionViewLayout.setActiveIndex(activeIndex)
            }

        }
    }

    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    deinit {
        unsubscribeCurrentLotState()
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        collectionView?.backgroundColor = .white
        collectionView?.register(LotListCollectionViewCell.self, forCellWithReuseIdentifier: LotListCollectionViewCell.CellIdentifier)
        
        // Sale status view setup.
        salesPerson.saleOnHoldSignal.subscribe { [weak self] onHold in
            self?.saleIsOnHold = onHold
            self?.updateTitle()
        }
        
        let navController = (navigationController as? ARSerifNavigationViewController)
        let isCompact = (UIScreen.main.traitCollection.horizontalSizeClass == .compact)
        
        if isCompact {
            navController?.hideCloseButton = false
        } else {
            navController?.hideCloseButton = true
        }

        if ARAppStatus.isBetaDevOrAdmin() {
            setupAdminTools(isCompact, navController: navController)
        }
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        updateTitle()
    }
    
    override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)
        
        updateTitle()
    }

    func setupAdminTools(_ isCompact: Bool, navController: ARSerifNavigationViewController?) {

        navController?.hideCloseButton = false

        let image = UIImage(named: "MapAnnotation_Artsy")
        let button = ARSerifToolbarButtonItem(image: image)
        button?.button.addTarget(self, action: #selector(showAdminMenu), for: .touchUpInside)

        if isCompact {
            self.navigationItem.rightBarButtonItems = [button!, button!]
        } else {
            self.navigationItem.rightBarButtonItems = [button!]
        }
    }

    func closeLotModal(_ button: UIButton) {
        self.presentingViewController?.dismiss(animated: true, completion: nil)
    }

    func showAdminMenu(_ button: UIButton) {
        let adminVC = LiveAuctionsAdminViewController(salesPerson: salesPerson)
        self.navigationController?.pushViewController(adminVC, animated: true)
    }

    func unsubscribeCurrentLotState() {
        currentLotStateSubscription?.unsubscribe()
        currentLotStateSubscription = nil
    }

    func lotAtIndexPath(_ indexPath: IndexPath) -> LiveAuctionLotViewModelType {
        return salesPerson.lotViewModelForIndex(indexPath.item)
    }
}

private typealias PrivateFunctions = LiveAuctionLotListViewController
extension PrivateFunctions {
    func updateTitle() {
        navigationItem.title = nil
        navigationItem.titleView = nil
        navigationItem.leftBarButtonItem = nil
        
        let isCompact = (UIScreen.main.traitCollection.horizontalSizeClass == .compact)
        
        // On iPhone, show "lots" since we're taking up the full screen.
        // Otherwise, on iPad, show the sale name (since users can see the lot list and the live interface).
        if isCompact {
            navigationItem.title = "Lots"
        } else {
            if saleIsOnHold {
                // TODO: explain why leftBarButtonItem and not titleView
                navigationItem.leftBarButtonItem = SaleStatusView.barButtonItem()
            } else {
                navigationItem.title = salesPerson.liveSaleName
            }
        }
    }
}

private typealias CollectionView = LiveAuctionLotListViewController
extension CollectionView {
    override func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return salesPerson.lotCount
    }

    override func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: LotListCollectionViewCell.CellIdentifier, for: indexPath)

        let viewModel = lotAtIndexPath(indexPath)
        (cell as? LotListCollectionViewCell)?.configureForViewModel(viewModel, indexPath: indexPath)

        cell.isSelected = (indexPath.row == selectedIndex)
        return cell
    }

    override func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        if let oldSelectedIndex = selectedIndex {
            collectionView.deselectItem(at: IndexPath(row: oldSelectedIndex, section: 0), animated: true)
        }

        selectedIndex = indexPath.row
        delegate?.didSelectLotAtIndex(indexPath.item, forLotListViewController: self)
    }
}

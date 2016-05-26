import UIKit
import Interstellar


protocol LiveAuctionLotListViewControllerDelegate: class {
    func didSelectLotAtIndex(index: Int, forLotListViewController lotListViewController: LiveAuctionLotListViewController)
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
                let path = NSIndexPath(forRow: selectedIndex, inSection: 0)
                collectionView?.selectItemAtIndexPath(path, animated: false, scrollPosition: .None)
            }
        }
    }

    weak var delegate: LiveAuctionLotListViewControllerDelegate?

    private var currentLotSignalObserver: ObserverToken<LiveAuctionLotViewModelType?>!

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

            // A lot can be the _current_ lot without being _opened_ yet. We check the current lot state to make sure that the activeIndex of the layout corresponds to the lotState that the cells are using to render themselves.
            sSelf.currentLotStateSubscription = lot.lotStateSignal.subscribe { lotState in
                let activeIndex: Int? = (lotState == .LiveLot ? lot.lotIndex : nil)
                self?.stickyCollectionViewLayout.setActiveIndex(activeIndex)
            }
            
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    deinit {
        currentLotStateSubscription?.unsubscribe()
        unsubscribeCurrentLotState()
    }

    override func viewDidLoad() {
        collectionView?.backgroundColor = .whiteColor()

        collectionView?.registerClass(LotListCollectionViewCell.self, forCellWithReuseIdentifier: LotListCollectionViewCell.CellIdentifier)
    }

    func unsubscribeCurrentLotState() {
        currentLotStateSubscription?.unsubscribe()
        currentLotStateSubscription = nil
    }

    func lotAtIndexPath(indexPath: NSIndexPath) -> LiveAuctionLotViewModelType {
        return salesPerson.lotViewModelForIndex(indexPath.item)
    }
}

private typealias CollectionView = LiveAuctionLotListViewController
extension CollectionView {
    override func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return salesPerson.lotCount
    }

    override func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCellWithReuseIdentifier(LotListCollectionViewCell.CellIdentifier, forIndexPath: indexPath)

        let viewModel = lotAtIndexPath(indexPath)
        (cell as? LotListCollectionViewCell)?.configureForViewModel(viewModel, indexPath: indexPath)

        cell.selected = (indexPath.row == selectedIndex)
        return cell
    }

    override func collectionView(collectionView: UICollectionView, didSelectItemAtIndexPath indexPath: NSIndexPath) {
        if let oldSelectedIndex = selectedIndex {
            collectionView.deselectItemAtIndexPath(NSIndexPath(forRow: oldSelectedIndex, inSection: 0), animated: true)
        }

        selectedIndex = indexPath.row
        delegate?.didSelectLotAtIndex(indexPath.item, forLotListViewController: self)
    }
}



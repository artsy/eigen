import UIKit
import Interstellar


class LiveAuctionLotListViewController: UICollectionViewController {
    let lots: [LiveAuctionLotViewModelType]
    let currentLotSignal: Signal<LiveAuctionLotViewModelType>
    let stickyCollectionViewLayout: LiveAuctionLotListStickyCellCollectionViewLayout
    let auctionViewModel: LiveAuctionViewModelType

    init(lots: [LiveAuctionLotViewModelType], currentLotSignal: Signal<LiveAuctionLotViewModelType>, auctionViewModel: LiveAuctionViewModelType) {
        self.lots = lots
        self.currentLotSignal = currentLotSignal
        self.stickyCollectionViewLayout = LiveAuctionLotListStickyCellCollectionViewLayout()
        self.auctionViewModel = auctionViewModel

        super.init(collectionViewLayout: self.stickyCollectionViewLayout)

        currentLotSignal.next { [weak self] lot in
            self?.stickyCollectionViewLayout.setActiveIndex(lot.lotIndex - 1) // Remember, lot indices are one-indexed
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    override func viewDidLoad() {
        collectionView?.backgroundColor = .whiteColor()

        collectionView?.registerClass(LotListCollectionViewCell.self, forCellWithReuseIdentifier: LotListCollectionViewCell.CellIdentifier)
    }

    func lotAtIndexPath(indexPath: NSIndexPath) -> LiveAuctionLotViewModelType {
        return lots[indexPath.item]
    }
}


private typealias CollectionView = LiveAuctionLotListViewController
extension CollectionView {
    override func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return lots.count
    }

    override func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCellWithReuseIdentifier(LotListCollectionViewCell.CellIdentifier, forIndexPath: indexPath)

        let viewModel = lotAtIndexPath(indexPath)
        (cell as? LotListCollectionViewCell)?.configureForViewModel(viewModel, auctionViewModel: auctionViewModel)

        return cell
    }
}



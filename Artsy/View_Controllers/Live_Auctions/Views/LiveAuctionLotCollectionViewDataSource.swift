import UIKit

class LiveAuctionLotCollectionViewDataSource: NSObject {

    static let RestingIndex = 1
    static let CellIdentifier = "Cell"
    static let CellClass = LiveAuctionLotImageCollectionViewCell.self

    let salesPerson: LiveAuctionsSalesPersonType

    init(salesPerson: LiveAuctionsSalesPersonType) {
        self.salesPerson = salesPerson
    }

}

private typealias CollectionViewDataSource = LiveAuctionLotCollectionViewDataSource
extension CollectionViewDataSource: UICollectionViewDataSource {

    func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        // We always have three, for: previous, current, and next. We rely on the UIPageViewCotrollerDelegate callbacks 
        // in the SalesPerson to update our colleciton view's content offset and the corresponding currentFocusedLotIndex.
        return 3
    }

    func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
        let _cell = collectionView.dequeueReusableCellWithReuseIdentifier(LiveAuctionLotCollectionViewDataSource.CellIdentifier, forIndexPath: indexPath)
        guard let cell = _cell as? LiveAuctionLotImageCollectionViewCell else { return _cell }

        let adjustedDelta = indexPath.item - 1
        let lot = salesPerson.lotViewModelRelativeToShowingIndex(adjustedDelta)

        cell.configureForLot(lot)

        return cell
    }

}

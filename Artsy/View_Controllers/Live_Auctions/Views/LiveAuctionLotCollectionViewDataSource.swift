import UIKit

class LiveAuctionLotCollectionViewDataSource: NSObject {

    static let RestingIndex = 1
    static let CellIdentifier = "Cell"
    static let CellClass = LiveAuctionLotImageCollectionViewCell.self

    let salesPerson: LiveAuctionsSalesPersonType

    init(salesPerson: LiveAuctionsSalesPersonType) {
        self.salesPerson = salesPerson
    }

    private func offsetForIndex(index: Int) -> Int {
        return index - 1
    }
}

private typealias CollectionViewDataSource = LiveAuctionLotCollectionViewDataSource
extension CollectionViewDataSource: UICollectionViewDataSource {

    func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        // We always have three, for: previous, current, and next. We rely on the UIPageViewControllerDelegate callbacks
        // in the SalesPerson to update our collection view's content offset and the corresponding currentFocusedLotIndex.
        return 3
    }

    func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
        let _cell = collectionView.dequeueReusableCellWithReuseIdentifier(LiveAuctionLotCollectionViewDataSource.CellIdentifier, forIndexPath: indexPath)
        guard let cell = _cell as? LiveAuctionLotImageCollectionViewCell else { return _cell }

        let lot = salesPerson.lotViewModelRelativeToShowingIndex(offsetForIndex(indexPath.item))

        cell.configureForLot(lot, atIndex: indexPath.item)

        return cell
    }

}

private typealias FancyLayoutDelegate = LiveAuctionLotCollectionViewDataSource
extension FancyLayoutDelegate: LiveAuctionFancyLotCollectionViewDelegateLayout {

    func aspectRatioForIndex(index: Int) -> CGFloat {
        let lot = salesPerson.lotViewModelRelativeToShowingIndex(offsetForIndex(index))
        return lot.imageAspectRatio
    }

    func thumbnailURLForIndex(index: Int) -> NSURL {
        let lot = salesPerson.lotViewModelRelativeToShowingIndex(offsetForIndex(index))
        return lot.urlForThumbnail
    }

}

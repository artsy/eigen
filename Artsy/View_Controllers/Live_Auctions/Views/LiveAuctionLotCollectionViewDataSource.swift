import UIKit
import SDWebImage

class LiveAuctionLotCollectionViewDataSource: NSObject {

    static let RestingIndex = 1
    static let CellIdentifier = "Cell"
    static let CellClass = LiveAuctionLotImageCollectionViewCell.self

    let salesPerson: LiveAuctionsSalesPersonType
    let imagePrefetcher = SDWebImagePrefetcher.sharedImagePrefetcher()

    init(salesPerson: LiveAuctionsSalesPersonType) {
        self.salesPerson = salesPerson
        super.init()

        ar_dispatch_after(2) { [weak self] in
            self?.beginThumnailPrecache()
        }
    }

    func beginThumnailPrecache() {
        let thumnailURLs = (1..<salesPerson.lotCount).map { return salesPerson.lotViewModelForIndex($0).urlForThumbnail }
        imagePrefetcher.prefetchURLs(thumnailURLs)
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
extension FancyLayoutDelegate: LiveAuctionLotCollectionViewDelegateLayout {

    func aspectRatioForIndex(index: RelativeIndex) -> CGFloat {
        let lot = salesPerson.lotViewModelRelativeToShowingIndex(offsetForIndex(index))
        return lot.imageAspectRatio
    }

    func thumbnailURLForIndex(index: RelativeIndex) -> NSURL {
        let lot = salesPerson.lotViewModelRelativeToShowingIndex(offsetForIndex(index))
        return lot.urlForThumbnail
    }

}

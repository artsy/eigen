import UIKit

class LiveAuctionLotCollectionViewDataSource: NSObject {

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
        return salesPerson.lotCount
    }

    func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCellWithReuseIdentifier(LiveAuctionLotCollectionViewDataSource.CellIdentifier, forIndexPath: indexPath)

        if let cell = cell as? LiveAuctionLotImageCollectionViewCell {
            let lot = salesPerson.lotViewModelForIndex(indexPath.item)
            cell.configureForLot(lot)
        }

        return cell
    }

}

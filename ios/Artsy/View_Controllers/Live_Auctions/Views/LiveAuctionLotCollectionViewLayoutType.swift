import UIKit

typealias RelativeIndex = Int

protocol LiveAuctionLotCollectionViewDelegateLayout: AnyObject {
    func aspectRatioForIndex(_ index: RelativeIndex) -> CGFloat
    func thumbnailURLForIndex(_ index: RelativeIndex) -> URL?
}

protocol LiveAuctionLotCollectionViewLayoutType: AnyObject {
    var delegate: LiveAuctionLotCollectionViewDelegateLayout { get }

    var repulsionConstant: CGFloat { get set }
}

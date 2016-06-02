import UIKit

typealias RelativeIndex = Int

protocol LiveAuctionLotCollectionViewDelegateLayout: class {
    func aspectRatioForIndex(index: RelativeIndex) -> CGFloat
    func thumbnailURLForIndex(index: RelativeIndex) -> NSURL
}

protocol LiveAuctionLotCollectionViewLayoutType: class {
    unowned var delegate: LiveAuctionLotCollectionViewDelegateLayout { get }

    var repulsionConstant: CGFloat { get set }
}

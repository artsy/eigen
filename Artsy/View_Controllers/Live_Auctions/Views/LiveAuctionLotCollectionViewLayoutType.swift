import UIKit

typealias RelativeIndex = Int

protocol LiveAuctionLotCollectionViewDelegateLayout: class {
    func aspectRatioForIndex(_ index: RelativeIndex) -> CGFloat
    func thumbnailURLForIndex(_ index: RelativeIndex) -> URL?
}

protocol LiveAuctionLotCollectionViewLayoutType: class {
    unowned var delegate: LiveAuctionLotCollectionViewDelegateLayout { get }

    var repulsionConstant: CGFloat { get set }
}

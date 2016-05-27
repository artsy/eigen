import UIKit

protocol LiveAuctionSaleLotsDataSourceScrollableDelgate: class {
    func registerForScrollingState(viewController: LiveAuctionLotViewController)
}

class LiveAuctionSaleLotsDataSource : NSObject, UIPageViewControllerDataSource {
    var salesPerson: LiveAuctionsSalesPersonType!
    weak var scrollingDelegate: LiveAuctionSaleLotsDataSourceScrollableDelgate?

    func liveAuctionPreviewViewControllerForIndex(index: Int) -> LiveAuctionLotViewController? {
        guard 0..<salesPerson.lotCount ~= index else { return nil }
        let lotViewModel = salesPerson.lotViewModelForIndex(index)

        let auctionVC =  LiveAuctionLotViewController(
            index: index,
            lotViewModel: lotViewModel,
            salesPerson: salesPerson
        )

        scrollingDelegate?.registerForScrollingState(auctionVC)

        return auctionVC
    }

    func pageViewController(pageViewController: UIPageViewController, viewControllerBeforeViewController viewController: UIViewController) -> UIViewController? {
        if salesPerson.lotCount == 1 { return nil }

        guard let viewController = viewController as? LiveAuctionLotViewController else { return nil }
        var newIndex = viewController.index - 1
        if (newIndex < 0) { newIndex = salesPerson.lotCount - 1 }
        return liveAuctionPreviewViewControllerForIndex(newIndex)
    }

    func pageViewController(pageViewController: UIPageViewController, viewControllerAfterViewController viewController: UIViewController) -> UIViewController? {
        if salesPerson.lotCount == 1 { return nil }

        guard let viewController = viewController as? LiveAuctionLotViewController else { return nil }
        let newIndex = (viewController.index + 1) % salesPerson.lotCount;
        return liveAuctionPreviewViewControllerForIndex(newIndex)
    }
}

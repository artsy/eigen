import Foundation
import Interstellar

/// Something to pretend to either be a network model or whatever
/// for now it can just parse the embedded json, and move it to obj-c when we're doing real networking

protocol LiveAuctionsSalesPersonType {
    var currentIndexSignal: Signal<Int> { get }
    var auctionViewModel: LiveAuctionViewModel? { get }
    var pageControllerDelegate: LiveAuctionPageControllerDelegate! { get }

    func lotViewModelForIndex(index: Int) -> LiveAuctionLotViewModel?
    func lotViewModelRelativeToShowingIndex(offset: Int) -> LiveAuctionLotViewModel?
    var lotCount: Int { get }
    var updatedState: Signal<LiveAuctionsSalesPersonType> { get }
}

class LiveAuctionsSalesPerson:  NSObject, LiveAuctionsSalesPersonType {
    let saleID: String

    var auctionViewModel: LiveAuctionViewModel?
    let updatedState = Signal<LiveAuctionsSalesPersonType>()
    var pageControllerDelegate: LiveAuctionPageControllerDelegate!

    private var lots = [LiveAuctionLotViewModel]()
    private var sale: LiveAuctionViewModel?
    private let stateManager: LiveAuctionStateManager

    var currentIndexSignal = Signal<Int>()

    func lotViewModelRelativeToShowingIndex(offset: Int) -> LiveAuctionLotViewModel? {
        guard let currentlyShowingIndex = currentIndexSignal.peek() else { return nil }
        let newIndex = currentlyShowingIndex + offset
        let loopingIndex = newIndex > 0 ? newIndex : lots.count + offset
        return lotViewModelForIndex(loopingIndex)
    }

    func lotViewModelForIndex(index: Int) -> LiveAuctionLotViewModel? {
        guard 0..<lots.count ~= index else { return nil }

        return lots[index]
    }

    init(saleID: String, accessToken: String, defaults: NSUserDefaults = NSUserDefaults.standardUserDefaults()) {
        self.saleID = saleID
        let host = defaults.stringForKey(ARStagingLiveAuctionSocketURLDefault) ?? "http://localhost:5000"
        stateManager = LiveAuctionStateManager(host: host, saleID: saleID, accessToken: accessToken)

        super.init()

        pageControllerDelegate = LiveAuctionPageControllerDelegate(salesPerson: self)


        updatedState.update(self)

        stateManager
            .newLotsSignal
            .next { [weak self] lots in
                self?.lots = lots
            }

        stateManager
            .saleSignal
            .next { [weak self] sale in
                self?.sale = sale
            }
    }

    var lotCount: Int {
        return auctionViewModel?.lotCount ?? 0
    }
}

class LiveAuctionPageControllerDelegate: NSObject, UIPageViewControllerDelegate {
    let salesPerson: LiveAuctionsSalesPersonType

    init(salesPerson: LiveAuctionsSalesPersonType) {
        self.salesPerson = salesPerson
    }

    func pageViewController(pageViewController: UIPageViewController, didFinishAnimating finished: Bool, previousViewControllers: [UIViewController], transitionCompleted completed: Bool) {

        guard let viewController = pageViewController.viewControllers?.first as? LiveAuctionLotViewController else { return }
        salesPerson.currentIndexSignal.update(viewController.index)
    }
}

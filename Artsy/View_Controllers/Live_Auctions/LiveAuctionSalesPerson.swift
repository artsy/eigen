import Foundation
import Interstellar

/// Something to pretend to either be a network model or whatever
/// for now it can just parse the embedded json, and move it to obj-c when we're doing real networking

protocol LiveAuctionsSalesPersonType {
    var currentFocusedLot: Observable<Int> { get }
    var updatedStateSignal: Observable<LiveAuctionViewModelType> { get }
    var currentLotSignal: Observable<LiveAuctionLotViewModelType> { get }

    var auctionViewModel: LiveAuctionViewModelType? { get }
    var pageControllerDelegate: LiveAuctionPageControllerDelegate! { get }
    var lots: [LiveAuctionLotViewModelType] { get }
    var lotCount: Int { get }

    func lotViewModelForIndex(index: Int) -> LiveAuctionLotViewModelType?
    func lotViewModelRelativeToShowingIndex(offset: Int) -> LiveAuctionLotViewModelType?

    func bidOnLot(lot: LiveAuctionLotViewModelType)
    func leaveMaxBidOnLot(lot: LiveAuctionLotViewModel)
}

class LiveAuctionsSalesPerson:  NSObject, LiveAuctionsSalesPersonType {
    typealias StateManagerCreator = (host: String, saleID: String, accessToken: String) -> LiveAuctionStateManager

    let saleID: String

    var auctionViewModel: LiveAuctionViewModelType?
    var pageControllerDelegate: LiveAuctionPageControllerDelegate!

    private(set) var lots = [LiveAuctionLotViewModelType]()
    private let stateManager: LiveAuctionStateManager

    // Lot currentloy being looked at by the user.
    var currentFocusedLot = Observable<Int>()

    init(saleID: String,
         accessToken: String,
         defaults: NSUserDefaults = NSUserDefaults.standardUserDefaults(),
         stateManagerCreator: StateManagerCreator = LiveAuctionsSalesPerson.defaultStateManagerCreator()) {

        self.saleID = saleID
        let host = defaults.stringForKey(ARStagingLiveAuctionSocketURLDefault) ?? "http://localhost:5000"
        stateManager = stateManagerCreator(host: host, saleID: saleID, accessToken: accessToken)

        super.init()

        pageControllerDelegate = LiveAuctionPageControllerDelegate(salesPerson: self)


        stateManager
            .newLotsSignal
            .subscribe { [weak self] lots -> Void in
                self?.lots = lots
            }

        stateManager
            .saleSignal
            .subscribe { [weak self] sale -> Void in
                self?.auctionViewModel = sale
            }
    }
}

private typealias ComputedProperties = LiveAuctionsSalesPerson
extension ComputedProperties {
    var currentLotSignal: Observable<LiveAuctionLotViewModelType> {
        return stateManager.currentLotSignal
    }

    var updatedStateSignal: Observable<LiveAuctionViewModelType> {
        return stateManager
            .saleSignal
            .merge(stateManager.newLotsSignal) // Reacts to a change in the lots as well.
            .map { auctionViewModel, _ -> LiveAuctionViewModelType in
                return auctionViewModel
            }
    }

    var lotCount: Int {
        return auctionViewModel?.lotCount ?? 0
    }
}


private typealias PublicFunctions = LiveAuctionsSalesPerson
extension LiveAuctionsSalesPerson {

    func lotViewModelRelativeToShowingIndex(offset: Int) -> LiveAuctionLotViewModelType? {
        guard let currentlyShowingIndex = currentFocusedLot.peek() else { return nil }
        let newIndex = currentlyShowingIndex + offset
        let loopingIndex = newIndex > 0 ? newIndex : lots.count + offset
        return lotViewModelForIndex(loopingIndex)
    }

    func lotViewModelForIndex(index: Int) -> LiveAuctionLotViewModelType? {
        guard 0..<lots.count ~= index else { return nil }

        return lots[index]
    }

    func bidOnLot(lot: LiveAuctionLotViewModelType) {
        stateManager.bidOnLot("") // TODO: Extract lot ID once https://github.com/artsy/eigen/pull/1386 is merged.
    }

    func leaveMaxBidOnLot(lot: LiveAuctionLotViewModel) {
        stateManager.bidOnLot("") // TODO: Extract lot ID once https://github.com/artsy/eigen/pull/1386 is merged.
    }
}

private typealias ClassMethods = LiveAuctionsSalesPerson
extension ClassMethods {

    class func defaultStateManagerCreator() -> StateManagerCreator {
        return { host, saleID, accessToken in
            LiveAuctionStateManager(host: host, saleID: saleID, accessToken: accessToken)
        }
    }

    class func stubbedStateManagerCreator() -> StateManagerCreator {
        return { host, saleID, accessToken in
            // TODO: stub the socket communicator.
            LiveAuctionStateManager(host: host, saleID: saleID, accessToken: accessToken)
        }
    }

}


class LiveAuctionPageControllerDelegate: NSObject, UIPageViewControllerDelegate {
    let salesPerson: LiveAuctionsSalesPersonType

    init(salesPerson: LiveAuctionsSalesPersonType) {
        self.salesPerson = salesPerson
    }

    func pageViewController(pageViewController: UIPageViewController, didFinishAnimating finished: Bool, previousViewControllers: [UIViewController], transitionCompleted completed: Bool) {

        guard let viewController = pageViewController.viewControllers?.first as? LiveAuctionLotViewController else { return }
        salesPerson.currentFocusedLot.update(viewController.index)
    }
}

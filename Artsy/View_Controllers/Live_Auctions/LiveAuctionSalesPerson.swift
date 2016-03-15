import Foundation
import Interstellar

/// Something to pretend to either be a network model or whatever
/// for now it can just parse the embedded json, and move it to obj-c when we're doing real networking

// Hrm, `: UIPageViewControllerDelegate` is definitely a bit weird, but LiveAuctionsSalesPerson should really know the currently showing index :/

protocol LiveAuctionsSalesPersonType {
    var currentIndexSignal: Signal<Int> { get }

    var auctionViewModel: LiveAuctionViewModel { get }

    func lotViewModelForIndex(index: Int) -> LiveAuctionLotViewModel?
    func lotViewModelRelativeToShowingIndex(offset: Int) -> LiveAuctionLotViewModel?

    // Remove me
    func setupWithStub()
}

class LiveAuctionsSalesPerson:  NSObject, LiveAuctionsSalesPersonType, UIPageViewControllerDelegate {

    private var lots: [LiveAuctionLot] = []
    private var sale: LiveSale!
    private var events: [String: LiveEvent]!

    var currentIndexSignal = Signal<Int>()

    var auctionViewModel: LiveAuctionViewModel {
        return LiveAuctionViewModel(sale: sale, salesPerson: self)
    }

    func lotViewModelRelativeToShowingIndex(offset: Int) -> LiveAuctionLotViewModel? {
        guard let currentlyShowingIndex = currentIndexSignal.peek() else { return nil }
        let newIndex = currentlyShowingIndex + offset
        let loopingIndex = newIndex > 0 ? newIndex : lots.count + offset
        return lotViewModelForIndex(loopingIndex)
    }

    func lotViewModelForIndex(index: Int) -> LiveAuctionLotViewModel? {
        if (0..<lots.count ~= index) {
            return LiveAuctionLotViewModel(
                lot: lots[index],
                auction:auctionViewModel,
                events:eventsViewModelsForLot(lots[index]),
                index: index)
        }
        return nil
    }

    func eventsViewModelsForLot(lot: LiveAuctionLot) -> [LiveAuctionEventViewModel] {
        return lot.events.flatMap { self.events[$0] }.map { LiveAuctionEventViewModel(event: $0) }
    }

    func setupWithStub() {
        let jsonPath = NSBundle.mainBundle().pathForResource("live_auctions", ofType: "json")
        let jsonData = NSData(contentsOfFile: jsonPath!)!
        let json = try! NSJSONSerialization.JSONObjectWithData(jsonData, options: .AllowFragments)

        setupWithInitialJSON(json)
    }

    // note this needs to leave the main thread
    func setupWithInitialJSON(json: AnyObject) {

        guard let lots = json["lots"] as? [String: [String: AnyObject]] else { return }
        guard let sale = json["sale"] as? [String: AnyObject] else { return }
        guard let events = json["lotEvents"] as? [String: [String: AnyObject]]  else { return }

        self.sale = LiveSale(JSON: sale)
        let unordered_lots: [LiveAuctionLot] = lots.values.map { LiveAuctionLot(JSON: $0) }
        self.lots = unordered_lots.sort { return $0.position < $1.position }

        let eventModels: [LiveEvent] = events.values.flatMap { LiveEvent(JSON: $0) }
        var eventDictionary: [String: LiveEvent] = [:]
        for event in eventModels {
            eventDictionary[event.eventID] = event
        }
        self.events = eventDictionary
    }

    func pageViewController(pageViewController: UIPageViewController, didFinishAnimating finished: Bool, previousViewControllers: [UIViewController], transitionCompleted completed: Bool) {

        guard let viewController = pageViewController.viewControllers?.first as? LiveAuctionLotViewController else { return }
        currentIndexSignal.update(viewController.index)
    }
}
import Foundation
import Interstellar

/// Something to pretend to either be a network model or whatever
/// for now it can just parse the embedded json, and move it to obj-c when we're doing real networking

protocol LiveAuctionsSalesPersonType {
    var currentIndex: Int { get }
    var lotCount: Int { get }
    var auctionViewModel: LiveAuctionViewModel? { get }
    var updatedState: Signal<LiveAuctionsSalesPersonType> { get }

    func lotViewModelForIndex(index: Int) -> LiveAuctionLotViewModel?

    // Remove me
    func setupWithStub()
}

class LiveAuctionsSalesPerson: NSObject, LiveAuctionsSalesPersonType {
    let saleID: String

    var currentIndex = 0
    var auctionViewModel: LiveAuctionViewModel?
    let updatedState = Signal<LiveAuctionsSalesPersonType>()

    private var lots = [LiveAuctionLot]()
    private var sale: LiveSale?
    private var events = [String: LiveEvent]()
    private let stateManager: LiveAuctionStateManager

    func lotViewModelForIndex(index: Int) -> LiveAuctionLotViewModel? {
        guard let auctionViewModel = auctionViewModel else { return nil }
        guard 0..<lots.count ~= index else { return nil }

        return LiveAuctionLotViewModel(
            lot: lots[index],
            auction: auctionViewModel,
            events: eventsViewModelsForLot(lots[index]),
            index: index)
    }

    init(saleID: String, accessToken: String, defaults: NSUserDefaults = NSUserDefaults.standardUserDefaults()) {
        self.saleID = saleID
        let host = defaults.stringForKey(ARStagingLiveAuctionSocketURLDefault) ?? "http://localhost:5000"
        stateManager = LiveAuctionStateManager(saleID: saleID, accessToken: accessToken, host: host)

        super.init()

        stateManager
            .updatedState
            .next { [weak self] state in
                self?.setupWithInitialJSON(state)
                print(self?.lots)
                self?.updatedState.update(self!)
            }
    }

    func eventsViewModelsForLot(lot: LiveAuctionLot) -> [LiveAuctionEventViewModel] {
        return lot.events.flatMap { self.events[$0] }.map { LiveAuctionEventViewModel(event: $0) }
    }

    var lotCount: Int {
        return auctionViewModel?.lotCount ?? 0
    }

    func setupWithStub() {
        let jsonPath = NSBundle.mainBundle().pathForResource("live_auctions", ofType: "json")
        let jsonData = NSData(contentsOfFile: jsonPath!)!
        let json = try! NSJSONSerialization.JSONObjectWithData(jsonData, options: .AllowFragments)

        setupWithInitialJSON(json)
    }

    // note this needs to leave the main thread
    func setupWithInitialJSON(json: AnyObject) {

        guard let lotsJSON = json["lots"] as? [String: [String: AnyObject]] else { return }
        guard let saleJSON = json["sale"] as? [String: AnyObject] else { return }
        guard let eventsJSON = json["lotEvents"] as? [String: [String: AnyObject]]  else { return }

        let sale = LiveSale(JSON: saleJSON)
        self.sale = sale
        let unordered_lots: [LiveAuctionLot] = lotsJSON.values.map { LiveAuctionLot(JSON: $0) }
        self.lots = unordered_lots.sort { return $0.position < $1.position }

        let eventModels: [LiveEvent] = eventsJSON.values.flatMap { LiveEvent(JSON: $0) }
        var eventDictionary: [String: LiveEvent] = [:]
        for event in eventModels {
            eventDictionary[event.eventID] = event
        }
        self.events = eventDictionary

        auctionViewModel = LiveAuctionViewModel(sale: sale, salesPerson: self)
    }
}
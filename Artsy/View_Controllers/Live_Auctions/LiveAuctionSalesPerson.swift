import Foundation

/// Something to pretend to either be a network model or whatever
/// for now it can just parse the embedded json, and move it to obj-c when we're doing real networking

protocol LiveAuctionsSalesPersonType {
    var currentIndex: Int { get }
    var auctionViewModel: LiveAuctionViewModel { get }
    func lotViewModelForIndex(index: Int) -> LiveAuctionLotViewModel?

    // Remove me
    func setupWithStub()
}

class LiveAuctionsSalesPerson:  NSObject, LiveAuctionsSalesPersonType {
    var currentIndex = 0

    let saleID: String

    private var lots = [LiveAuctionLot]()
    private var sale: LiveSale! // TODO: Remove IUO
    private var events = [String: LiveEvent]()
    private let stateManager: LiveAuctionStateManager

    var auctionViewModel: LiveAuctionViewModel {
        return LiveAuctionViewModel(sale: sale, salesPerson: self)
    }

    func lotViewModelForIndex(index: Int) -> LiveAuctionLotViewModel? {
        if (0..<lots.count ~= index) {

            return LiveAuctionLotViewModel(
                lot: lots[index],
                auction: auctionViewModel,
                events: eventsViewModelsForLot(lots[index]),
                index: index)
        }
        return nil
    }

    init(saleID: String, accessToken: String) {
        self.saleID = saleID
        stateManager = LiveAuctionStateManager(saleID: saleID, accessToken: accessToken)

        super.init()
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
}
@testable
import Artsy


class Fake_AuctionsSalesPerson: NSObject, LiveAuctionsSalesPersonType {
    var currentIndex = 0
    
    var lots: [LiveAuctionLot] = []
    var sale: LiveSale!
    var events: [String: LiveEvent]!

    var auctionViewModel: LiveAuctionViewModel {
        return LiveAuctionViewModel(sale: sale, salesPerson: self)
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

    override init () {
        super.init()
        setupWithStub()
    }

    func setupWithStub() {
        let jsonPath = NSBundle.mainBundle().pathForResource("live_auctions", ofType: "json")
        let jsonData = NSData(contentsOfFile: jsonPath!)!
        let json = try! NSJSONSerialization.JSONObjectWithData(jsonData, options: .AllowFragments) as! [String: AnyObject]

        setupWithInitialJSON(json)
    }

    func setupWithInitialJSON(json: [String: AnyObject]) {

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
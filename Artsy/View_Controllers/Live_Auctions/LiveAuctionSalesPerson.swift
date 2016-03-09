import Foundation

/// Something to pretend to either be a network model or whatever
/// for now it can just parse the embedded json, and move it to obj-c when we're doing real networking

protocol LiveAuctionsSalesPersonType {
    var auctionViewModel: LiveAuctionViewModel { get }
    func lotViewModelForIndex(index: Int) -> LiveAuctionLotViewModel?

    // Remove me
    func setupWithStub()
}

class LiveAuctionsSalesPerson:  NSObject, LiveAuctionsSalesPersonType {
    private var currentIndex = 0

    private var lots: [LiveAuctionLot] = []
    private var sale: LiveSale!
    private var events: [LiveEvent]!

    var auctionViewModel: LiveAuctionViewModel {
        return LiveAuctionViewModel(sale: sale, salesPerson: self)
    }

    func lotViewModelForIndex(index: Int) -> LiveAuctionLotViewModel? {
        if (0..<lots.count ~= index) {
            return LiveAuctionLotViewModel(lot: lots[index], auction:auctionViewModel , index: index)
        }
        return nil
    }

    func setupWithStub() {
        let jsonPath = NSBundle.mainBundle().pathForResource("live_auctions", ofType: "json")
        let jsonData = NSData(contentsOfFile: jsonPath!)!
        let json = try! NSJSONSerialization.JSONObjectWithData(jsonData, options: .AllowFragments)

        setupWithInitialJSON(json)
    }

    func setupWithInitialJSON(json: AnyObject) {

        guard let lots = json["lots"] as? [String: [String: AnyObject]] else { return }
        guard let sale = json["sale"] as? [String: AnyObject] else { return }
        guard let events = json["lotEvents"] as? [String: [String: AnyObject]]  else { return }

        self.sale = LiveSale(JSON: sale)
        let unordered_lots: [LiveAuctionLot] = lots.values.map { LiveAuctionLot(JSON: $0) }
        self.lots = unordered_lots.sort { return $0.position < $1.position }

        self.events = events.values.flatMap { LiveEvent(JSON: $0) }
    }
}
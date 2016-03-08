@testable
import Artsy


class Fake_AuctionsSalesPerson: NSObject, LiveAuctionsSalesPersonType {
    var lots: [LiveAuctionLot] = []
    var sale: LiveSale!
    var events: [LiveEvent]!

    var auctionViewModel: LiveAuctionViewModel {
        return LiveAuctionViewModel(sale: sale, salesPerson: self)
    }

    func lotViewModelForIndex(index: Int) -> LiveAuctionLotViewModel? {
        if (0..<lots.count ~= index) {
            return LiveAuctionLotViewModel(lot: lots[index], auction:auctionViewModel , index: index)
        }
        return nil
    }

    override init () {
        let jsonPath = NSBundle.mainBundle().pathForResource("live_auctions", ofType: "json")
        let jsonData = NSData(contentsOfFile: jsonPath!)!
        let json = try! NSJSONSerialization.JSONObjectWithData(jsonData, options: .AllowFragments) as! [String: AnyObject]
        super.init()
        setupWithInitialJSON(json)
    }


    // Not DRY, but can be amended once we have a strucutre for dealing with inputs that come from the network

    func setupWithStub() {

    }

    func setupWithInitialJSON(json: [String: AnyObject]) {

        guard let lots = json["lots"] as? [String: [String: AnyObject]] else { return }
        guard let sale = json["sale"] as? [String: AnyObject] else { return }
        guard let events = json["lotEvents"] as? [String: [String: AnyObject]]  else { return }

        self.sale = LiveSale(JSON: sale)
        let unordered_lots: [LiveAuctionLot] = lots.values.map { LiveAuctionLot(JSON: $0) }
        self.lots = unordered_lots.sort { return $0.position < $1.position }

        self.events = events.values.flatMap { LiveEvent(JSON: $0) }
    }
}
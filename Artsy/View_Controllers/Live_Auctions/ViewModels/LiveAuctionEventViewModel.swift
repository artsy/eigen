import Foundation

class LiveAuctionEventViewModel : NSObject {
    let event: LiveEvent
    let currencySymbol: String

    var isBid: Bool {
        return event.eventType() == .Bid
    }

    var isLotOpening: Bool {
        return event.eventType() == .LotOpen
    }

    var dateEventCreated: NSDate {
        return ARStandardDateFormatter.sharedFormatter().dateFromString(event.createdAtString)
    }

    func isTopBidderID(bidderID: String) -> Bool {
        guard let bidder = event.bidder else { return false }
        return bidder.bidderID == bidderID
    }

    var eventTitle: NSAttributedString {
        switch event.eventType() {
        case .Bid:

            guard let event = event as? LiveEventBid else { return attributify("BID", .blackColor())  }
            return attributify(event.sourceOrDefaultString.uppercaseString, .blackColor())

        case .Closed: return  attributify("CLOSED", .blackColor())
        case .Warning: return attributify("WARNING", yellow())
        case .FinalCall: return attributify("FINAL CALL", orange())
        case .LotOpen: return attributify("LOT OPEN FOR BIDDING", purple())

        case .Unknown: return attributify("", orange())
        }
    }

    var eventSubtitle: NSAttributedString {
        switch event.eventType() {
        case .Bid:
            guard let event = event as? LiveEventBid else { return attributify("BID", .blackColor())  }

            let formattedPrice = event.amountCents.convertToDollarString(currencySymbol)
            return attributify(formattedPrice, .blackColor())

        case .Closed: return NSAttributedString()
        case .Warning: return attributifyImage("live_auction_bid_warning_yellow")
        case .FinalCall: return attributifyImage("live_auction_bid_warning_orange")
        case .LotOpen: return attributifyImage("live_auction_bid_hammer")

        case .Unknown: return NSAttributedString()
        }
    }

    func attributify(string: String, _ color: UIColor) -> NSAttributedString {
        return NSAttributedString(string: string, attributes: [NSForegroundColorAttributeName : color])
    }

    func attributifyImage(name: String) -> NSAttributedString {
        let textAttachment = NSTextAttachment()
        textAttachment.image = UIImage(named: name)
        return NSAttributedString(attachment: textAttachment)
    }

    // HACK: Temporary

    func yellow() -> UIColor {
        return UIColor(red:0.909804, green:0.701961, blue:0.0, alpha:1.0)
    }

    func orange() -> UIColor {
        return UIColor(red:0.937255, green:0.454902, blue:0.290196, alpha:1.0)
    }

    func red() -> UIColor {
        return UIColor(red:0.945098, green:0.294118, blue:0.27451, alpha:1.0)
    }

    func purple() -> UIColor {
        return UIColor(red:0.305882, green:0.0, blue:0.92549, alpha:1.0)
    }

    func green() -> UIColor {
        return UIColor(red:0.0823529, green:0.803922, blue:0.184314, alpha:1.0)
    }

    func grey() -> UIColor {
        return UIColor(red:0.423529, green:0.423529, blue:0.423529, alpha:1.0)
    }


    init(event:LiveEvent, currencySymbol: String) {
        self.event = event
        self.currencySymbol = currencySymbol
    }
}
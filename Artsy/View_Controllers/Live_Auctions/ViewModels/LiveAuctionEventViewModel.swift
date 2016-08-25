import Foundation

enum BidEventBidStatus {
    case Bid(isMine: Bool, isTop: Bool)
    case PendingBid(isMine: Bool)
}

protocol LiveAuctionEventViewModelType {
    // Empty for now, most of our code deals with the actual class directly.
}

class LiveAuctionEventViewModel: NSObject, LiveAuctionEventViewModelType {
    let event: LiveEvent
    let currencySymbol: String

    var bidStatus: BidEventBidStatus?

    var eventID: String {
        return event.eventID
    }

    var isBid: Bool {
        return event.eventType() == .Bid
    }

    var confirmed: Bool {
        return event.confirmed
    }

    var isBidConfirmation: Bool {
        return event.eventType() == .BidComposite
    }

    var bidConfirmationEventID: String? {
        if !isBidConfirmation { return nil }
        return event.hostedEventID
    }

    var isArtsyBidder: Bool {
        return event.bidder?.type == "ArtsyBidder"
    }

    var isFloorBidder: Bool {
        return event.bidder?.type == "OfflineBidder"
    }

    var isLotOpening: Bool {
        return event.eventType() == .LotOpen
    }

    var isUndo: Bool {
        return event.eventType() == .Undo
    }

    var undoLiveEventID: String? {
        if !isUndo { return nil }
        return event.hostedEventID
    }

    var isUserFacing: Bool {
        switch event.eventType() {
        case .Unknown, .BidComposite, .Undo:
            return false
        default:
            return true
        }
    }

    var dateEventCreated: NSDate {
        return ARStandardDateFormatter.sharedFormatter().dateFromString(event.createdAtString)
    }

    func hasBidderID(bidderID: String) -> Bool {
        guard let bidder = event.bidder else { return false }
        return bidder.bidderID == bidderID
    }

    var bidConfirmationAmount: UInt64? {
        if !isBidConfirmation { return nil }
        return event.amountCents
    }

    var bidAmountCents: UInt64? {
        if !isBid { return nil}
        return event.amountCents
    }

    func hasAmountCents(amount: UInt64 ) -> Bool {
        return event.amountCents == amount
    }

    func cancel() {
        event.cancelled = true
    }

    func confirm() {
        event.confirmed = true
    }

    private func colorForBidStatus(status: BidEventBidStatus) -> UIColor {
        switch status {
        case .Bid(let isMine, let isTop):
            var color: UIColor
            if isMine && isTop {
                color = .artsyGreenRegular()
            } else if isMine && !isTop {
                color = red()
            } else {
                color = .blackColor()
            }

            // Override color when cancelled
            color = event.cancelled ? .artsyGrayMedium() : color
            return color

        case .PendingBid:
            return .artsyGrayMedium()
        }
    }

    var eventTitle: NSAttributedString {
        switch event.eventType() {
        case .Bid:
            guard
                let event = event as? LiveEventBid,
                let status = bidStatus else { return attributify("ERROR", .redColor()) }

            switch status {
            case .Bid(let isMine, _):
                let display = isMine ? "Your Bid" : event.displayString()
                let color = colorForBidStatus(status)
                return attributify(display.uppercaseString, color, strike: event.cancelled)

            case .PendingBid(let isMine):
                let display = isMine ? "Your Bid" : event.displayString()
                return attributify(display.uppercaseString, .artsyGrayMedium(), strike: event.cancelled)
            }

        case .Closed: return  attributify("CLOSED", .blackColor(), strike: event.cancelled)
        case .Warning: return attributify("WARNING", yellow(), strike: event.cancelled)
        case .FinalCall: return attributify("FINAL CALL", orange(), strike: event.cancelled)
        // TODO: "LOT [number] OPEN FOR BIDDING
        case .LotOpen:
            guard let event = event as? LiveEventLotOpen else { return attributify("", .blackColor())  }
            return attributify("LOT OPEN FOR BIDDING", purple(), strike: event.cancelled)

        /// Ideal world, none of these would happen
        case .Unknown: return NSAttributedString()
        case .BidComposite: return NSAttributedString()
        case .Undo: return NSAttributedString()
        }
    }

    var eventSubtitle: NSAttributedString {
        switch event.eventType() {
        case .Bid:
            guard
                let event = event as? LiveEventBid,
                let status = bidStatus else { return attributify("ERROR", .redColor()) }

            let color = colorForBidStatus(status)
            let formattedPrice = event.amountCents.convertToDollarString(currencySymbol)
            return attributify(formattedPrice, color, strike: event.cancelled)

        case .Closed: return NSAttributedString()
        case .Warning: return attributifyImage("live_auction_bid_warning_yellow")
        case .FinalCall: return attributifyImage("live_auction_bid_warning_orange")
        case .LotOpen: return attributifyImage("live_auction_bid_hammer")

        /// Ideal world, none of these would happen
        case .Unknown: return NSAttributedString()
        case .BidComposite: return NSAttributedString()
        case .Undo: return NSAttributedString()
        }
    }

    func attributify(string: String, _ color: UIColor, strike: Bool = false) -> NSAttributedString {
        var attributes: [String:AnyObject] = [NSForegroundColorAttributeName : color]
        if strike { attributes[NSStrikethroughStyleAttributeName] = NSUnderlineStyle.StyleSingle.rawValue }
        return NSAttributedString(string: string, attributes:attributes)
    }

    func attributifyImage(name: String) -> NSAttributedString {
        let textAttachment = NSTextAttachment()
        textAttachment.image = UIImage(named: name)
        return NSAttributedString(attachment: textAttachment)
    }



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


    init(event: LiveEvent, currencySymbol: String) {
        self.event = event
        self.currencySymbol = currencySymbol
    }
}

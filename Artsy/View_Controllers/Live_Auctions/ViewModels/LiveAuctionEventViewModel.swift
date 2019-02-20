import Foundation

enum BidEventBidStatus {
    case bid(isMine: Bool, isTop: Bool, userIsFloorWinningBidder: Bool)
    case pendingBid(isMine: Bool)
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
        return event.eventType() == .bid
    }

    var confirmed: Bool {
        return event.confirmed
    }

    var isBidConfirmation: Bool {
        return event.eventType() == .bidComposite
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
        return event.eventType() == .lotOpen
    }

    var isUndo: Bool {
        return event.eventType() == .undo
    }

    var isFairWarning: Bool {
        return event.eventType() == .warning
    }

    var isFinalCall: Bool {
        return event.eventType() == .finalCall
    }

    var undoLiveEventID: String? {
        if !isUndo { return nil }
        return event.hostedEventID
    }

    var isUserFacing: Bool {
        switch event.eventType() {
        case .unknown, .bidComposite, .undo:
            return false
        default:
            return true
        }
    }

    var dateEventCreated: Date {
        return ARStandardDateFormatter.shared().date(from: event.createdAtString)
    }

    func hasBidderID(_ bidderID: String) -> Bool {
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

    func hasAmountCents(_ amount: UInt64 ) -> Bool {
        return event.amountCents == amount
    }

    func cancel() {
        event.cancelled = true
    }

    func confirm() {
        event.confirmed = true
    }

    fileprivate func colorForBidStatus(_ status: BidEventBidStatus) -> UIColor {
        switch status {
        case .bid(let isMine, let isTop, let userIsFloorWinningBidder):
            var color: UIColor
            if isMine && isTop && userIsFloorWinningBidder {
                color = .artsyGreenRegular()
            } else if isMine && isTop {
                color = UIColor.artsyGrayMedium()
            } else if isMine && !isTop {
                color = red()
            } else {
                color = .black
            }

            // Override color when cancelled
            color = event.cancelled ? .artsyGrayMedium() : color
            return color

        case .pendingBid:
            return .artsyGrayMedium()
        }
    }

    var eventTitle: NSAttributedString {
        switch event.eventType() {
        case .bid:
            guard
                let event = event as? LiveEventBid,
                let status = bidStatus else { return attributify("ERROR", .red) }

            switch status {
            case .bid(let isMine, let isTop, _):
                let text: String
                if isMine && !isTop {
                    text = "You (Outbid)"
                } else if isMine {
                    text = "You"
                } else {
                    text = event.displayString()
                }
                let color = colorForBidStatus(status)
                return attributify(text.uppercased(), color, strike: event.cancelled)

            case .pendingBid(let isMine):
                let display = isMine ? "You" : event.displayString()
                return attributify(display.uppercased(), .artsyGrayMedium(), strike: event.cancelled)
            }

        case .closed: return  attributify("CLOSED", .black, strike: event.cancelled)
        case .warning: return attributify("WARNING", yellow(), strike: event.cancelled)
        case .finalCall: return attributify("FINAL CALL", orange(), strike: event.cancelled)
        // TODO: "LOT [number] OPEN FOR BIDDING
        case .lotOpen:
            guard let event = event as? LiveEventLotOpen else { return attributify("", .black)  }
            return attributify("LOT OPEN FOR BIDDING", purple(), strike: event.cancelled)

        /// Ideal world, none of these would happen
        case .unknown: return NSAttributedString()
        case .bidComposite: return NSAttributedString()
        case .undo: return NSAttributedString()
        }
    }

    var eventSubtitle: NSAttributedString {
        switch event.eventType() {
        case .bid:
            guard
                let event = event as? LiveEventBid,
                let status = bidStatus else { return attributify("ERROR", .red) }

            let color = colorForBidStatus(status)
            let formattedPrice = event.amountCents.convertToDollarString(currencySymbol)
            return attributify(formattedPrice, color, strike: event.cancelled)

        case .closed: return NSAttributedString()
        case .warning: return attributifyImage("live_auction_bid_warning_yellow")
        case .finalCall: return attributifyImage("live_auction_bid_warning_orange")
        case .lotOpen: return attributifyImage("live_auction_bid_hammer")

        /// Ideal world, none of these would happen
        case .unknown: return NSAttributedString()
        case .bidComposite: return NSAttributedString()
        case .undo: return NSAttributedString()
        }
    }

    func attributify(_ string: String, _ color: UIColor, strike: Bool = false) -> NSAttributedString {
        var attributes: [NSAttributedString.Key: AnyObject] = [NSAttributedString.Key.foregroundColor : color]
        if strike { attributes[NSAttributedString.Key.strikethroughStyle] = NSUnderlineStyle.single.rawValue as AnyObject? }
        return NSAttributedString(string: string, attributes:attributes)
    }

    func attributifyImage(_ name: String) -> NSAttributedString {
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

// Basically a Swift-based copy of https://github.com/artsy/prediction/blob/master/lib/socket_events.js

enum SocketEvent: String {
    case ConfirmOnlineBid = "CONFIRM_ONLINE_BID"
    case FairWarning = "FAIR_WARNING"
    case FinalCall = "FINAL_CALL"
    case JoinSale = "JOIN_SALE"
    case OpenLot = "OPEN_LOT"
    case PlaceBid = "PLACE_BID"
    case SellLot = "SELL_LOT"
    case UpdateAuctionState = "UPDATE_AUCTION_STATE"
}

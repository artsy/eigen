// Generated using SwiftGen, by O.Halligon — https://github.com/AliSoftware/SwiftGen

import UIKit

extension UIImage {
  enum Asset: String {
    case Chat_icon = "chat_icon"
    case Close_Icon = "Close_Icon"
    case Info_icon = "info_icon"
    case Live_auction_bid_hammer = "live_auction_bid_hammer"
    case Live_auction_bid_warning_orange = "live_auction_bid_warning_orange"
    case Live_auction_bid_warning_yellow = "live_auction_bid_warning_yellow"
    case LiveAuctionButtonNormalBackground = "LiveAuctionButtonNormalBackground"
    case LiveAuctionButtonNormalHighlighted = "LiveAuctionButtonNormalHighlighted"
    case LiveAuctionMaxBidIcon = "LiveAuctionMaxBidIcon"
    case LiveAuctionOutbidWarningIcon = "LiveAuctionOutbidWarningIcon"
    case LiveAuctionsDisclosureTriangleDown = "LiveAuctionsDisclosureTriangleDown"
    case LiveAuctionsDisclosureTriangleUp = "LiveAuctionsDisclosureTriangleUp"
    case LiveAuctionsMaxBidMinus = "LiveAuctionsMaxBidMinus"
    case LiveAuctionsMaxBidPlus = "LiveAuctionsMaxBidPlus"
    case LiveAuctionSpinner = "LiveAuctionSpinner"
    case Lot_bidder_hammer_white = "lot_bidder_hammer_white"
    case Lot_bidders_info = "lot_bidders_info"
    case Lot_lot_info = "lot_lot_info"
    case Lot_time_info = "lot_time_info"
    case Lot_watchers_info = "lot_watchers_info"
    case Lots_icon = "lots_icon"

    var image: UIImage {
      return UIImage(asset: self)
    }
  }

  convenience init!(asset: Asset) {
    self.init(named: asset.rawValue)
  }
}

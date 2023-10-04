import Foundation
import UIKit

// TODO: Depending on how widespread these become (talk to Katarina) we may move them into our colors pod.
extension UIColor {
    static func auctionGreen() -> UIColor {
        return UIColor.ar_color(withHex: 0x16d047)
    }

    static func auctionRed() -> UIColor {
        return UIColor.ar_color(withHex: 0xf5645c)
    }
}

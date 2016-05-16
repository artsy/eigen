import Foundation

// This module has the NSNumberFormatter methods we need
import Artsy_UILabels

protocol Centable {
    var number: NSNumber { get }
}

extension Int : Centable {
    var number: NSNumber {
        return self
    }
}

// Within the context of live auctions, numbers that represent cents
// are all UInt64 to ensure consistency across devices, and that
// people can make large bids.

extension UInt64 : Centable {
    var number: NSNumber {
        return NSNumber(unsignedLongLong: self)
    }
}

extension Centable {

    /// Turns a thousand dollars' worth of cents (like 1_000_00) into "$1k", etc.
    func metricSuffixify(currencySymbol: String) -> String {
        let number = self.number
        guard number.intValue > 1000_00 else { return NSNumberFormatter.currencyStringForDollarCents(number) }
        return NSNumberFormatter.currencyStringForDollarCents(removeKSignificantDigits().number) + "k"
    }

    func roundCentsToNearestThousandAndFormat(currencySymbol: String) -> String {
        let number = self.number
        guard number.intValue > 1000_00 else { return NSNumberFormatter.currencyStringForDollarCents(number) }
        return NSNumberFormatter.currencyStringForDollarCents(roundCentsToNearestThousand().number)
    }

    func convertToDollarString(currencySymbol: String) -> String {
        return NSNumberFormatter.currencyStringForDollarCents(self.number)
    }

    // Rounds a number (cents) down to the nearest thousand dollars.
    // So 1545_00 becomes 1000_00.
    // Numbers less than a thousand dollars are returned as-is.
    func roundCentsToNearestThousand() -> UInt64 {
        let number = self.number
        guard number.intValue > 1000_00 else { return number.unsignedLongLongValue }
        // dollarsFromCents will round something like 1500_00 up to $2000, but we want to round _down_.
        // So we divide by 1000_00 to turn us into dollars momentarily, then back into cents to remove their significant digits.
        let dollarsK = UInt64(floor(Float(self.number) / Float(1000_00)))
        let cents = dollarsK * 1000_00
        return cents
    }

    // Removes three significant digits from number.
    private func removeKSignificantDigits() -> UInt64 {
        return roundCentsToNearestThousand() / 1000
    }
}
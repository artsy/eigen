import Foundation

// This module has the NSNumberFormatter methods we need
import Artsy_UILabels

extension Int {


    /// Turns a thousand dollars' worth of cents (like 1_000_00) into "$1k", etc.
    func metricSuffixify() -> String {
        guard self > 1000_00 else { return NSNumberFormatter.currencyStringForDollarCents(self) }
        return NSNumberFormatter.currencyStringForDollarCents(removeKSignificantDigits()) + "k"
    }

    func roundCentsToNearestThousandAndFormat() -> String {
        guard self > 1000_00 else { return NSNumberFormatter.currencyStringForDollarCents(self) }
        return NSNumberFormatter.currencyStringForDollarCents(roundCentsToNearestThousand())
    }

    func convertToDollarString() -> String {
        return NSNumberFormatter.currencyStringForDollarCents(self)
    }


    // Rounds a number (cents) down to the nearest thousand dollars.
    // So 1545_00 becomes 1000_00.
    // Numbers less than a thousand dollars are returned as-is.
    func roundCentsToNearestThousand() -> Int {
        guard self > 1000_00 else { return self }
        // currencyStringForDollarCents will round something like 1500_00 up to $2000, but we want to round _down_.
        // So we divide by 1000_00 to turn us into dollars momentarily, then back into cents to remove their significant digits.
        let dollarsK = Int(floor(Float(self) / Float(1000_00)))
        let cents = Int(dollarsK) * 1000_00
        return cents
    }

    // Removes three significant digits from number.
    private func removeKSignificantDigits() -> Int {
        return roundCentsToNearestThousand() / 1000
    }
}

// Within the context of live auctions, numbers that represent cents
// are all UInt64 to ensure consistency across devices, and that 
// people can make large bids.

extension UInt64 {

    private var number: NSNumber {
        return NSNumber(unsignedLongLong: self)
    }

    /// Turns a thousand dollars' worth of cents (like 1_000_00) into "$1k", etc.
    func metricSuffixify() -> String {
        guard self > 1000_00 else { return NSNumberFormatter.currencyStringForDollarCents(self.number) }

        return NSNumberFormatter.currencyStringForDollarCents(removeKSignificantDigits().number) + "k"
    }

    func roundCentsToNearestThousandAndFormat() -> String {
        guard self > 1000_00 else { return NSNumberFormatter.currencyStringForDollarCents(self.number) }
        return NSNumberFormatter.currencyStringForDollarCents(roundCentsToNearestThousand().number)
    }

    func convertToDollarString() -> String {
        return NSNumberFormatter.currencyStringForDollarCents(self.number)
    }

    // Rounds a number (cents) down to the nearest thousand dollars.
    // So 1545_00 becomes 1000_00.
    // Numbers less than a thousand dollars are returned as-is.
    func roundCentsToNearestThousand() -> UInt64 {
        guard self > 1000_00 else { return self }
        // currencyStringForDollarCents will round something like 1500_00 up to $2000, but we want to round _down_.
        // So we divide by 1000_00 to turn us into dollars momentarily, then back into cents to remove their significant digits.
        let dollarsK = UInt64(floor(Float(self) / Float(1000_00)))
        let cents = UInt64(dollarsK) * 1000_00
        return cents
    }

    // Removes three significant digits from number.
    private func removeKSignificantDigits() -> UInt64 {
        return roundCentsToNearestThousand() / 1000
    }
}
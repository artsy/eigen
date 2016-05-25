import Foundation

private struct Formatter {
    private static var formatters = [String: NSNumberFormatter]()

    private static func createFormatter(currencySymbol: String) -> NSNumberFormatter {
        let newFormatter = NSNumberFormatter()
        newFormatter.locale = NSLocale.currentLocale()
        newFormatter.currencyCode = "USD"
        newFormatter.currencySymbol = currencySymbol
        newFormatter.numberStyle = .CurrencyStyle
        newFormatter.maximumFractionDigits = 0
        newFormatter.alwaysShowsDecimalSeparator = false
        return newFormatter
    }

    static func formatCents(number: NSNumber, currencySymbol: String) -> String! {
        let formatter: NSNumberFormatter
        if formatters[currencySymbol] == nil {
            formatter = createFormatter(currencySymbol)
            formatters[currencySymbol] = formatter
        } else {
            formatter = formatters[currencySymbol]!
        }

        return formatter.stringFromNumber(NSDecimalNumber(mantissa: number.unsignedLongLongValue, exponent: -2, isNegative: false))
    }
}

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
        guard number.intValue > 1000_00 else { return Formatter.formatCents(number, currencySymbol: currencySymbol) }
        return SaleArtwork.dollarsFromCents(removeKSignificantDigits().number, currencySymbol: currencySymbol) + "k"
    }

    func roundCentsToNearestThousandAndFormat(currencySymbol: String) -> String {
        let number = self.number
        guard number.intValue > 1000_00 else { return Formatter.formatCents(number, currencySymbol: currencySymbol) }
        return Formatter.formatCents(roundCentsToNearestThousand().number, currencySymbol: currencySymbol)
    }

    func convertToDollarString(currencySymbol: String) -> String {
        return Formatter.formatCents(number, currencySymbol: currencySymbol)
    }

    // Rounds a number (cents) down to the nearest thousand dollars.
    // So 1545_00 becomes 1000_00.
    // Numbers less than a thousand dollars are returned as-is.
    func roundCentsToNearestThousand() -> UInt64 {
        let number = self.number
        guard number.intValue > 1000_00 else { return number.unsignedLongLongValue }
        // dollarsFromCents will round something like 1500_00 up to $2000, but we want to round _down_.
        // So we divide by 1000_00 to turn us into dollars k momentarily, then back into cents to remove their significant digits.
        let dollarsK = UInt64(floor(Float(self.number) / Float(1000_00)))
        let cents = dollarsK * 1000_00
        return cents
    }

    // Removes three significant digits from number.
    private func removeKSignificantDigits() -> UInt64 {
        return roundCentsToNearestThousand() / 1000
    }
}
import Foundation

private struct Formatter {
    fileprivate static var formatters = [String: NumberFormatter]()

    fileprivate static func createFormatter(_ currencySymbol: String) -> NumberFormatter {
        let newFormatter = NumberFormatter()
        newFormatter.locale = Locale.current
        // TODO: We should ideally be DIing this too.
        // newFormatter.currencyCode = "USD"
        newFormatter.currencySymbol = currencySymbol
        newFormatter.numberStyle = .currency
        newFormatter.maximumFractionDigits = 0
        newFormatter.alwaysShowsDecimalSeparator = false
        return newFormatter
    }

    static func formatCents(_ number: NSNumber, currencySymbol: String) -> String! {
        let formatter: NumberFormatter
        switch formatters[currencySymbol] {
        case .none:
            formatter = createFormatter(currencySymbol)
            formatters[currencySymbol] = formatter
        case .some(let existingFormatter):
            formatter = existingFormatter
        }

        return formatter.string(from: NSDecimalNumber(mantissa: number.uint64Value, exponent: -2, isNegative: false))
    }
}

protocol Centable {
    var number: NSNumber { get }
}

extension Int : Centable {
    var number: NSNumber {
        return NSNumber(integerLiteral: self)
    }
}

// Within the context of live auctions, numbers that represent cents
// are all UInt64 to ensure consistency across devices, and that
// people can make large bids.

extension UInt64 : Centable {
    var number: NSNumber {
        return NSNumber(value: self as UInt64)
    }
}

extension Centable {

    /// Turns a thousand dollars' worth of cents (like 1_000_00) into "$1k", etc.
    func metricSuffixify(_ currencySymbol: String) -> String {
        let number = self.number
        guard number.int32Value > 1000_00 else { return Formatter.formatCents(number, currencySymbol: currencySymbol) }
        return SaleArtwork.dollars(fromCents: removeKSignificantDigits().number, currencySymbol: currencySymbol) + "k"
    }

    func roundCentsToNearestThousandAndFormat(_ currencySymbol: String) -> String {
        let number = self.number
        guard number.int32Value > 1000_00 else { return Formatter.formatCents(number, currencySymbol: currencySymbol) }
        return Formatter.formatCents(roundCentsToNearestThousand().number, currencySymbol: currencySymbol)
    }

    func convertToDollarString(_ currencySymbol: String) -> String {
        return Formatter.formatCents(number, currencySymbol: currencySymbol)
    }

    // Rounds a number (cents) down to the nearest thousand dollars.
    // So 1545_00 becomes 1000_00.
    // Numbers less than a thousand dollars are returned as-is.
    func roundCentsToNearestThousand() -> UInt64 {
        let number = self.number
        guard number.int32Value > 1000_00 else { return number.uint64Value }
        // dollarsFromCents will round something like 1500_00 up to $2000, but we want to round _down_.
        // So we divide by 1000_00 to turn us into dollars k momentarily, then back into cents to remove their significant digits.
        let dollarsK = UInt64(floor(Float(truncating: self.number) / Float(1000_00)))
        let cents = dollarsK * 1000_00
        return cents
    }

    // Removes three significant digits from number.
    fileprivate func removeKSignificantDigits() -> UInt64 {
        return roundCentsToNearestThousand() / 1000
    }
}

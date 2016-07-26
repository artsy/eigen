import Foundation

/// Compares two dates, returns true iff the lhs is before the rhs
public func < (lhs: NSDate, rhs: NSDate) -> Bool {
    return lhs.compare(rhs) == NSComparisonResult.OrderedAscending
}
